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
package org.apache.metron.rest.service.impl.blockly;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import java.util.ArrayList;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
public class Value {

  @XmlAttribute
  private String name;

  @XmlElement(name="block")
  private List<Block> blocks;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Value withName(String name) {
    this.name = name;
    return this;
  }

  public List<Block> getBlocks() {
    return blocks;
  }

  public void setBlocks(List<Block> blocks) {
    this.blocks = blocks;
  }

  public Value addBlock(Block block) {
    if (blocks == null) {
      blocks = new ArrayList<>();
    }
    blocks.add(block);
    return this;
  }
}
