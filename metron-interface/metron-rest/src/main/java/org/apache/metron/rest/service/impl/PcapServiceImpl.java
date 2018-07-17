/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.apache.metron.rest.service.impl;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.apache.commons.io.IOUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.metron.job.JobException;
import org.apache.metron.job.JobNotFoundException;
import org.apache.metron.job.JobStatus;
import org.apache.metron.job.Statusable;
import org.apache.metron.job.manager.JobManager;
import org.apache.metron.pcap.config.PcapOptions;
import org.apache.metron.rest.MetronRestConstants;
import org.apache.metron.rest.RestException;
import org.apache.metron.rest.config.PcapJobSupplier;
import org.apache.metron.rest.model.pcap.FixedPcapRequest;
import org.apache.metron.rest.model.pcap.PcapRequest;
import org.apache.metron.rest.model.pcap.PcapStatus;
import org.apache.metron.rest.model.pcap.Pdml;
import org.apache.metron.rest.service.PcapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@Service
public class PcapServiceImpl implements PcapService {

  private Environment environment;
  private Configuration configuration;
  private PcapJobSupplier pcapJobSupplier;
  private JobManager<Path> jobManager;

  @Autowired
  public PcapServiceImpl(Environment environment, Configuration configuration, PcapJobSupplier pcapJobSupplier, JobManager<Path> jobManager) {
    this.environment = environment;
    this.configuration = configuration;
    this.pcapJobSupplier = pcapJobSupplier;
    this.jobManager = jobManager;
  }

  @Override
  public PcapStatus fixed(String username, FixedPcapRequest fixedPcapRequest) throws RestException {
    try {
      setPcapOptions(fixedPcapRequest);
      fixedPcapRequest.setFields();
      pcapJobSupplier.setPcapRequest(fixedPcapRequest);
      JobStatus jobStatus = jobManager.submit(pcapJobSupplier, username);
      return jobStatusToPcapStatus(jobStatus);
    } catch (IOException | JobException e) {
      throw new RestException(e);
    }
  }

  @Override
  public PcapStatus getJobStatus(String username, String jobId) throws RestException {
    PcapStatus pcapStatus = null;
    try {
      Statusable<Path> statusable = jobManager.getJob(username, jobId);
      if (statusable != null) {
        pcapStatus = jobStatusToPcapStatus(statusable.getStatus());
      }
    } catch (JobNotFoundException e) {
      // do nothing and return null pcapStatus
    } catch (JobException e) {
      throw new RestException(e);
    }
    return pcapStatus;
  }

  @Override
  public Pdml getPdml(Path path) throws RestException {
    Pdml pdml = null;
    try {
      if (FileSystem.newInstance(path.toUri(), configuration).exists(path)) {
        ProcessBuilder processBuilder = getProcessBuilder(environment.getProperty(MetronRestConstants.PCAP_PDML_SCRIPT_PATH_SPRING_PROPERTY), path.toUri().getPath());
        Process process = processBuilder.start();
        InputStream rawInputStream = FileSystem.newInstance(path.toUri(), configuration).open(path);
        OutputStream processOutputStream = process.getOutputStream();
        IOUtils.copy(rawInputStream, processOutputStream);
        rawInputStream.close();
        if (process.isAlive()) {
          // need to close processOutputStream if script doesn't exit with an error
          processOutputStream.close();
          InputStream processInputStream = process.getInputStream();
          pdml = new XmlMapper().readValue(processInputStream, Pdml.class);
          processInputStream.close();
        } else {
          String errorMessage = IOUtils.toString(process.getErrorStream(), StandardCharsets.UTF_8);
          throw new RestException(errorMessage);
        }
      }
    } catch (IOException e) {
      e.printStackTrace();
      throw new RestException(e);
    }
    return pdml;
  }

  protected void setPcapOptions(PcapRequest pcapRequest) throws IOException {
    PcapOptions.JOB_NAME.put(pcapRequest, "jobName");
    PcapOptions.HADOOP_CONF.put(pcapRequest, configuration);
    PcapOptions.FILESYSTEM.put(pcapRequest, getFileSystem());

    if (pcapRequest.getBasePath() == null) {
      pcapRequest.setBasePath(environment.getProperty(MetronRestConstants.PCAP_BASE_PATH_SPRING_PROPERTY));
    }
    if (pcapRequest.getBaseInterimResultPath() == null) {
      pcapRequest.setBaseInterimResultPath(environment.getProperty(MetronRestConstants.PCAP_BASE_INTERIM_RESULT_PATH_SPRING_PROPERTY));
    }
    if (pcapRequest.getFinalOutputPath() == null) {
      pcapRequest.setFinalOutputPath(environment.getProperty(MetronRestConstants.PCAP_FINAL_OUTPUT_PATH_SPRING_PROPERTY));
    }

    PcapOptions.NUM_RECORDS_PER_FILE.put(pcapRequest, Integer.parseInt(environment.getProperty(MetronRestConstants.PCAP_PAGE_SIZE_SPRING_PROPERTY)));
  }

  protected FileSystem getFileSystem() throws IOException {
    return FileSystem.get(configuration);
  }

  protected ProcessBuilder getProcessBuilder(String... command) {
    return new ProcessBuilder(command);
  }

  protected PcapStatus jobStatusToPcapStatus(JobStatus jobStatus) {
    PcapStatus pcapStatus = new PcapStatus();
    pcapStatus.setJobId(jobStatus.getJobId());
    pcapStatus.setJobStatus(jobStatus.getState().toString());
    pcapStatus.setDescription(jobStatus.getDescription());
    pcapStatus.setPercentComplete(jobStatus.getPercentComplete());
    return pcapStatus;
  }
}
