/*
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

package org.apache.metron.indexing.dao.metaalert;

import static org.apache.metron.indexing.dao.metaalert.MetaAlertConstants.ALERT_FIELD;
import static org.apache.metron.indexing.dao.metaalert.MetaAlertConstants.METAALERT_FIELD;
import static org.apache.metron.indexing.dao.metaalert.MetaAlertConstants.METAALERT_TYPE;
import static org.apache.metron.indexing.dao.metaalert.MetaAlertConstants.STATUS_FIELD;
import static org.apache.metron.indexing.dao.metaalert.MetaAlertConstants.THREAT_FIELD_DEFAULT;
import static org.apache.metron.indexing.dao.metaalert.MetaAlertStatus.ACTIVE;
import static org.apache.metron.indexing.dao.metaalert.MetaAlertStatus.INACTIVE;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import org.adrianwalker.multilinestring.Multiline;
import org.apache.commons.math.util.MathUtils;
import org.apache.metron.common.Constants;
import org.apache.metron.indexing.dao.IndexDao;
import org.apache.metron.indexing.dao.search.GetRequest;
import org.apache.metron.indexing.dao.search.InvalidCreateException;
import org.apache.metron.indexing.dao.update.Document;
import org.apache.metron.indexing.dao.update.OriginalNotFoundException;
import org.apache.metron.indexing.dao.update.PatchRequest;
import org.apache.metron.indexing.dao.update.UpdateDao;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class MetaAlertUpdateDaoTest {

  private static final double EPS = 0.00001;
  private static final String METAALERT_INDEX = "metaalert_index";
  private static final String METAALERT_GUID = "meta_0";
  private static final String DEFAULT_PREFIX = "child_";
  @Mock
  IndexDao indexDao;

  TestMetaAlertUpdateDao dao = new TestMetaAlertUpdateDao();

  private class TestMetaAlertUpdateDao implements MetaAlertUpdateDao {

    Map<String, Document> documents = new HashMap<>();

    TestMetaAlertUpdateDao() {
      Document active = new Document(
          new HashMap<>(),
          ACTIVE.getStatusString(),
          METAALERT_TYPE,
          0L
      );
      documents.put(ACTIVE.getStatusString(), active);

      Document inactive = new Document(
          new HashMap<>(),
          INACTIVE.getStatusString(),
          METAALERT_TYPE,
          0L
      );
      inactive.getDocument().put(
          STATUS_FIELD,
          INACTIVE.getStatusString()
      );
      documents.put(INACTIVE.getStatusString(), inactive);
    }

//    @Override
//    public Document getLatest(String guid, String sensorType) {
//      return documents.get(guid);
//    }
//
//    @Override
//    public Iterable<Document> getAllLatest(List<GetRequest> getRequests) {
//      return null;
//    }
//
//    @Override
//    public IndexDao getIndexDao() {
//      return indexDao;
//    }
//
//    @Override
//    public String getMetAlertSensorName() {
//      return METAALERT_TYPE;
//    }
//
//    @Override
//    public String getMetaAlertIndex() {
//      return METAALERT_INDEX;
//    }

    @Override
    public void update(Document update, Optional<String> index) {

    }

    @Override
    public void batchUpdate(Map<Document, Optional<String>> updates) throws IOException {

    }

    @Override
    public void patch(PatchRequest request, Optional<Long> timestamp)
        throws OriginalNotFoundException, IOException {

    }

    @Override
    public MetaAlertCreateResponse createMetaAlert(MetaAlertCreateRequest request)
        throws InvalidCreateException, IOException {
      return null;
    }

    @Override
    public boolean addAlertsToMetaAlert(String metaAlertGuid, List<GetRequest> alertRequests)
        throws IOException {
      return false;
    }

    @Override
    public boolean removeAlertsFromMetaAlert(String metaAlertGuid, List<GetRequest> alertRequests)
        throws IOException {
      return false;
    }

    @Override
    public boolean updateMetaAlertStatus(String metaAlertGuid, MetaAlertStatus status)
        throws IOException {
      return false;
    }
  }

  /**
   {
   "guid": "meta_alert",
   "index": "metaalert_index",
   "patch": [
   {
   "op": "add",
   "path": "/alert",
   "value": []
   }
   ],
   "sensorType": "metaalert"
   }
   */
  @Multiline
  public static String alertPatchRequest;

  /**
   {
   "guid": "meta_alert",
   "index": "metaalert_index",
   "patch": [
   {
   "op": "add",
   "path": "/status",
   "value": []
   }
   ],
   "sensorType": "metaalert"
   }
   */
  @Multiline
  public static String statusPatchRequest;

  /**
   {
   "guid": "meta_alert",
   "index": "metaalert_index",
   "patch": [
   {
   "op": "add",
   "path": "/name",
   "value": []
   }
   ],
   "sensorType": "metaalert"
   }
   */
  @Multiline
  public static String namePatchRequest;

  @Test(expected = UnsupportedOperationException.class)
  public void testBatchUpdateThrowsException() throws IOException {
    dao.batchUpdate(null);
  }

  @Test
  @SuppressWarnings("unchecked")
  public void testPatchNotAllowedAlert() throws ParseException {
    PatchRequest pr = new PatchRequest();
    Map<String, Object> patch = (JSONObject) new JSONParser().parse(alertPatchRequest);
    pr.setPatch(Collections.singletonList((JSONObject) ((JSONArray) patch.get("patch")).get(0)));
    assertFalse(dao.isPatchAllowed(pr));
  }

  @Test
  @SuppressWarnings("unchecked")
  public void testPatchNotAllowedStatus() throws ParseException {
    PatchRequest pr = new PatchRequest();
    Map<String, Object> patch = (JSONObject) new JSONParser().parse(statusPatchRequest);
    pr.setPatch(Collections.singletonList((JSONObject) ((JSONArray) patch.get("patch")).get(0)));
    assertFalse(dao.isPatchAllowed(pr));
  }

  @Test
  @SuppressWarnings("unchecked")
  public void testPatchAllowedName() throws ParseException {
    PatchRequest pr = new PatchRequest();
    Map<String, Object> patch = (JSONObject) new JSONParser().parse(namePatchRequest);
    pr.setPatch(Collections.singletonList((JSONObject) ((JSONArray) patch.get("patch")).get(0)));
    assertTrue(dao.isPatchAllowed(pr));
  }

  @Test
  public void testUpdateSingle() throws IOException {
    Map<Document, Optional<String>> updates = new HashMap<>();
    Document document = new Document(new HashMap<>(), "guid", "sensor", 0L);
    updates.put(document, Optional.empty());
    dao.update(updates);
    verify(indexDao, times(1)).update(document, Optional.empty());
  }

  @Test
  public void testUpdateMultiple() throws IOException {
    Map<Document, Optional<String>> updates = new HashMap<>();
    Document documentOne = new Document(new HashMap<>(), "guid", "sensor", 0L);
    updates.put(documentOne, Optional.empty());
    Document documentTwo = new Document(new HashMap<>(), "guid2", "sensor", 0L);
    updates.put(documentTwo, Optional.empty());
    dao.update(updates);
    verify(indexDao, times(1)).batchUpdate(updates);
  }

  @Test(expected = IllegalStateException.class)
  public void testAddAlertsToMetaAlertInactive() throws IOException {
    dao.addAlertsToMetaAlert(INACTIVE.getStatusString(), null);
  }

  @Test
  public void testBuildAddAlertToMetaAlertUpdatesEmpty() {
    Document metaDoc = new Document(
        new HashMap<>(),
        METAALERT_GUID,
        METAALERT_TYPE,
        0L
    );
    metaDoc.getDocument().put(
        ALERT_FIELD,
        getRawMaps(buildChildAlerts(1, METAALERT_GUID, null))
    );
    Map<Document, Optional<String>> actual = dao
        .buildAddAlertToMetaAlertUpdates(metaDoc, new ArrayList<>());
    assertEquals(0, actual.size());
  }

  @Test
  public void testBuildAddAlertToMetaAlertUpdates() {
    List<Document> alerts = buildChildAlerts(1, METAALERT_GUID, null);

    Document metaDoc = buildMetaAlert(alerts);

    List<Document> newAlerts = buildChildAlerts(2, null, "new_");
    Map<Document, Optional<String>> actual = dao
        .buildAddAlertToMetaAlertUpdates(metaDoc, newAlerts);
    assertEquals(3, actual.size());

    HashMap<String, Object> expectedExistingAlert = new HashMap<>();
    expectedExistingAlert.put(Constants.GUID, "child_0");
    expectedExistingAlert.put(METAALERT_FIELD, Collections.singletonList(METAALERT_GUID));
    expectedExistingAlert.put(THREAT_FIELD_DEFAULT, 0.0f);

    List<Map<String, Object>> expectedAlerts = new ArrayList<>();
    expectedAlerts.add(expectedExistingAlert);
    expectedAlerts.addAll(getRawMaps(newAlerts));

    List<Double> scores = new ArrayList<>();
    scores.add(0.0d);
    scores.add(0.0d);
    scores.add(0.0d);

    Map<String, Object> expectedMetaAlertMap = new HashMap<>();
    expectedMetaAlertMap.put(Constants.GUID, METAALERT_GUID);
    expectedMetaAlertMap.put(ALERT_FIELD, expectedAlerts);
    expectedMetaAlertMap.put(THREAT_FIELD_DEFAULT, 0.0f);

    expectedMetaAlertMap.putAll(new MetaScores(scores).getMetaScores());
    Document expectedMetaAlertDoc = new Document(expectedMetaAlertMap, METAALERT_GUID,
        METAALERT_TYPE,
        0L);

    Map<Document, Optional<String>> expected = new HashMap<>();
    expected.put(expectedMetaAlertDoc, Optional.of(METAALERT_INDEX));
    expected.put(newAlerts.get(0), Optional.empty());
    expected.put(newAlerts.get(1), Optional.empty());

    assertTrue(updatesMapEquals(expected, actual));
  }

  @Test
  public void testRemoveAlertsFromMetaAlert() throws IOException {
    List<Document> alerts = buildChildAlerts(3, METAALERT_GUID, null);

    Document metaDoc = buildMetaAlert(alerts);

    List<Document> deletedAlerts = new ArrayList<>();
    deletedAlerts.add(alerts.get(0));
    deletedAlerts.add(alerts.get(2));

    Map<Document, Optional<String>> actual = dao
        .buildRemoveAlertsFromMetaAlert(metaDoc, deletedAlerts);
    assertEquals(3, actual.size());

    Map<String, Object> expectedDeletedAlert = new HashMap<>();
    expectedDeletedAlert.put(Constants.GUID, "child_0");
    expectedDeletedAlert.put(THREAT_FIELD_DEFAULT, 0.0f);
    expectedDeletedAlert
        .put(MetaAlertConstants.METAALERT_FIELD, new ArrayList<>());
    Document expectedDeletedDocument = new Document(expectedDeletedAlert, "child_0", "test", 0L);

    Map<String, Object> expectedDeletedAlert3 = new HashMap<>();
    expectedDeletedAlert3.put(Constants.GUID, "child_2");
    expectedDeletedAlert3.put(THREAT_FIELD_DEFAULT, 0.0f);
    expectedDeletedAlert3
        .put(MetaAlertConstants.METAALERT_FIELD, new ArrayList<>());
    Document expectedDeletedDocument2 = new Document(expectedDeletedAlert3, "child_2", "test", 0L);

    List<Map<String, Object>> expectedAlerts = new ArrayList<>();
    expectedAlerts.add(alerts.get(1).getDocument());

    Map<String, Object> expectedMetaAlertMap = new HashMap<>();
    expectedMetaAlertMap.put(Constants.GUID, METAALERT_GUID);
    expectedMetaAlertMap.put(ALERT_FIELD, expectedAlerts);
    expectedMetaAlertMap.put(THREAT_FIELD_DEFAULT, 0.0f);
    expectedMetaAlertMap.putAll(new MetaScores(Collections.singletonList(0.0d)).getMetaScores());
    Document expectedMetaAlertDoc = new Document(expectedMetaAlertMap, METAALERT_GUID,
        METAALERT_TYPE,
        0L);

    Map<Document, Optional<String>> expected = new HashMap<>();
    expected.put(expectedDeletedDocument, Optional.empty());
    expected.put(expectedDeletedDocument2, Optional.empty());
    expected.put(expectedMetaAlertDoc, Optional.of(METAALERT_INDEX));

    assertTrue(updatesMapEquals(expected, actual));
  }

  @Test
  public void testRemoveAlertsFromMetaAlertNoChildAlerts() {
    Document empty = new Document(new HashMap<>(), "empty", METAALERT_TYPE, 0L);
    boolean actual = dao.removeAlertsFromMetaAlert(empty, Collections.singletonList("child"));
    assertFalse(actual);
  }

  @Test
  public void testRemoveAlertsFromMetaAlertEmptyRemoveList() {
    Document metaDoc = new Document(
        new HashMap<>(),
        METAALERT_GUID,
        METAALERT_TYPE,
        0L
    );
    metaDoc.getDocument().put(
        STATUS_FIELD,
        ACTIVE.getStatusString()
    );
    metaDoc.getDocument().put(
        ALERT_FIELD,
        new HashMap<String, Object>() {{
          put(Constants.GUID, "child_0");
        }}
    );
    boolean actual = dao.removeAlertsFromMetaAlert(metaDoc, new ArrayList<>());
    assertFalse(actual);
  }

  @Test
  public void testRemoveAlertsFromMetaAlertEmptyRemoveSingle() {
    Document metaDoc = new Document(
        new HashMap<>(),
        METAALERT_GUID,
        METAALERT_TYPE,
        0L
    );
    metaDoc.getDocument().put(
        STATUS_FIELD,
        ACTIVE.getStatusString()
    );
    List<Map<String, Object>> alerts = new ArrayList<>();
    alerts.add(new HashMap<String, Object>() {{
      put(Constants.GUID, "child_0");
    }});
    metaDoc.getDocument().put(
        ALERT_FIELD,
        alerts
    );
    boolean actual = dao.removeAlertsFromMetaAlert(metaDoc, Collections.singletonList("child_0"));

    Document expected = new Document(
        new HashMap<>(),
        METAALERT_GUID,
        METAALERT_TYPE,
        0L
    );
    expected.getDocument().put(
        STATUS_FIELD,
        ACTIVE.getStatusString()
    );
    expected.getDocument().put(ALERT_FIELD, new ArrayList<>());
    assertTrue(actual);
    assertEquals(expected, metaDoc);
  }

  @Test
  public void testBuildStatusChangeUpdatesToInactive() {
    List<Document> alerts = buildChildAlerts(2, METAALERT_GUID, null);

    Map<String, Object> metaAlertMap = new HashMap<>();
    metaAlertMap.put(ALERT_FIELD, getRawMaps(alerts));
    metaAlertMap.put(Constants.GUID, METAALERT_GUID);
    metaAlertMap.put(STATUS_FIELD, MetaAlertStatus.ACTIVE.getStatusString());
    Document metaDoc = new Document(
        metaAlertMap,
        METAALERT_GUID,
        METAALERT_TYPE,
        0L
    );

    Map<Document, Optional<String>> actual = dao
        .buildStatusChangeUpdates(metaDoc, alerts, MetaAlertStatus.INACTIVE);
    assertEquals(3, actual.size());

    List<Document> expectedDeletedAlerts = buildChildAlerts(2, null, null);
    List<Map<String, Object>> expectedAlerts = new ArrayList<>();
    expectedAlerts.add(alerts.get(0).getDocument());
    expectedAlerts.add(alerts.get(1).getDocument());

    Map<String, Object> expectedMetaAlertMap = new HashMap<>();
    expectedMetaAlertMap.put(Constants.GUID, METAALERT_GUID);
    expectedMetaAlertMap.put(ALERT_FIELD, expectedAlerts);
    expectedMetaAlertMap.put(STATUS_FIELD, MetaAlertStatus.INACTIVE.getStatusString());
    Document expectedMetaAlertDoc = new Document(expectedMetaAlertMap, METAALERT_GUID,
        METAALERT_TYPE,
        0L);

    Map<Document, Optional<String>> expected = new HashMap<>();
    expected.put(expectedMetaAlertDoc, Optional.of(METAALERT_INDEX));
    expected.put(expectedDeletedAlerts.get(0), Optional.empty());
    expected.put(expectedDeletedAlerts.get(1), Optional.empty());

    assertTrue(updatesMapEquals(expected, actual));
  }

  @Test
  public void testBuildStatusChangeUpdatesToActive() {
    List<Document> alerts = buildChildAlerts(2, METAALERT_GUID, null);

    Map<String, Object> metaAlertMap = new HashMap<>();
    metaAlertMap.put(ALERT_FIELD, getRawMaps(alerts));
    metaAlertMap.put(Constants.GUID, METAALERT_GUID);
    metaAlertMap.put(STATUS_FIELD, MetaAlertStatus.INACTIVE.getStatusString());
    Document metaDoc = new Document(
        metaAlertMap,
        METAALERT_GUID,
        METAALERT_TYPE,
        0L
    );

    Map<Document, Optional<String>> actual = dao.buildStatusChangeUpdates(
        metaDoc,
        alerts,
        MetaAlertStatus.ACTIVE
    );

    List<Map<String, Object>> expectedAlerts = new ArrayList<>();
    expectedAlerts.add(alerts.get(0).getDocument());
    expectedAlerts.add(alerts.get(1).getDocument());

    Map<String, Object> expectedMetaAlertMap = new HashMap<>();
    expectedMetaAlertMap.put(ALERT_FIELD, expectedAlerts);
    expectedMetaAlertMap.put(Constants.GUID, METAALERT_GUID);
    expectedMetaAlertMap.put(STATUS_FIELD, MetaAlertStatus.ACTIVE.getStatusString());
    Document expectedMetaAlertDoc = new Document(
        expectedMetaAlertMap,
        METAALERT_GUID,
        METAALERT_TYPE,
        0L
    );

    Map<Document, Optional<String>> expected = new HashMap<>();
    expected.put(expectedMetaAlertDoc, Optional.of(METAALERT_INDEX));

    assertTrue(updatesMapEquals(expected, actual));
  }

  @Test
  public void testRemoveAlertsFromMetaAlertEmptyRemoveMultiple() {
    Document metDoc = new Document(new HashMap<>(), METAALERT_GUID, METAALERT_TYPE, 0L);
    metDoc.getDocument().put(STATUS_FIELD, ACTIVE.getStatusString());
    List<Document> alerts = buildChildAlerts(3, null, null);
    metDoc.getDocument().put(ALERT_FIELD, getRawMaps(alerts));
    List<String> removeGuids = new ArrayList<>();
    removeGuids.add("child_0");
    removeGuids.add("child_2");
    removeGuids.add("child_doesn't_exist");

    boolean actual = dao.removeAlertsFromMetaAlert(metDoc, removeGuids);

    // Build the expected metaalert
    Document expected = new Document(new HashMap<>(), METAALERT_GUID, METAALERT_TYPE, 0L);
    expected.getDocument().put(STATUS_FIELD, ACTIVE.getStatusString());
    List<Map<String, Object>> alertsExpected = new ArrayList<>();
    alertsExpected.add(new HashMap<String, Object>() {{
                         put(METAALERT_FIELD, new ArrayList<>());
                         put(Constants.GUID, "child_1");
                         put(THREAT_FIELD_DEFAULT, 0.0f);
                       }}
    );

    expected.getDocument().put(ALERT_FIELD, alertsExpected);
    assertEquals(expected, metDoc);
    assertTrue(actual);
  }

  @Test(expected = IllegalStateException.class)
  public void testRemoveAlertsFromMetaAlertInactive() throws IOException {
    dao.removeAlertsFromMetaAlert(INACTIVE.getStatusString(), null);
  }

  @Test
  public void testRemoveMetaAlertFromAlertSuccess() {
    List<String> metaAlertGuids = new ArrayList<>();
    metaAlertGuids.add("metaalert1");
    metaAlertGuids.add("metaalert2");
    Map<String, Object> alertFields = new HashMap<>();
    alertFields.put(METAALERT_FIELD, metaAlertGuids);
    Document alert = new Document(alertFields, "alert", "test", 0L);

    Document expected = new Document(new HashMap<>(), "alert", "test", 0L);
    List<String> expectedMetaAlertGuids = new ArrayList<>();
    expectedMetaAlertGuids.add("metaalert2");
    expected.getDocument().put(METAALERT_FIELD, expectedMetaAlertGuids);

    boolean actual = dao.removeMetaAlertFromAlert("metaalert1", alert);
    assertTrue(actual);
    assertEquals(expected, alert);
  }

  @Test
  public void testRemoveMetaAlertFromAlertMissing() {
    List<String> metaAlertGuids = new ArrayList<>();
    metaAlertGuids.add("metaalert1");
    metaAlertGuids.add("metaalert2");
    Map<String, Object> alertFields = new HashMap<>();
    alertFields.put(METAALERT_FIELD, metaAlertGuids);
    Document alert = new Document(alertFields, "alert", "test", 0L);

    boolean actual = dao.removeMetaAlertFromAlert("metaalert3", alert);
    assertFalse(actual);
  }

  @Test
  public void testAddMetaAlertToAlertEmpty() {
    Map<String, Object> alertFields = new HashMap<>();
    alertFields.put(METAALERT_FIELD, new ArrayList<>());
    Document alert = new Document(alertFields, "alert", "test", 0L);

    Document expected = new Document(new HashMap<>(), "alert", "test", 0L);
    List<String> expectedMetaAlertGuids = new ArrayList<>();
    expectedMetaAlertGuids.add("metaalert1");
    expected.getDocument().put(METAALERT_FIELD, expectedMetaAlertGuids);

    boolean actual = dao.addMetaAlertToAlert("metaalert1", alert);
    assertTrue(actual);
    assertEquals(expected, alert);
  }

  @Test
  public void testAddMetaAlertToAlertNonEmpty() {
    List<String> metaAlertGuids = new ArrayList<>();
    metaAlertGuids.add("metaalert1");
    Map<String, Object> alertFields = new HashMap<>();
    alertFields.put(METAALERT_FIELD, metaAlertGuids);
    Document alert = new Document(alertFields, "alert", "test", 0L);

    Document expected = new Document(new HashMap<>(), "alert", "test", 0L);
    List<String> expectedMetaAlertGuids = new ArrayList<>();
    expectedMetaAlertGuids.add("metaalert1");
    expectedMetaAlertGuids.add("metaalert2");
    expected.getDocument().put(METAALERT_FIELD, expectedMetaAlertGuids);

    boolean actual = dao.addMetaAlertToAlert("metaalert2", alert);
    assertTrue(actual);
    assertEquals(expected, alert);
  }

  @Test
  public void testAddMetaAlertToAlertDuplicate() {
    List<String> metaAlertGuids = new ArrayList<>();
    metaAlertGuids.add("metaalert1");
    Map<String, Object> alertFields = new HashMap<>();
    alertFields.put(METAALERT_FIELD, metaAlertGuids);
    Document alert = new Document(alertFields, "alert", "test", 0L);

    boolean actual = dao.addMetaAlertToAlert("metaalert1", alert);
    assertFalse(actual);
  }

  // Utility method to manage comparing update maps
  protected boolean updatesMapEquals(Map<Document, Optional<String>> expected,
      Map<Document, Optional<String>> actual) {
    Entry<Document, Optional<String>> expectedMetaEntry;
    Entry<Document, Optional<String>> actualMetaEntry;

    expectedMetaEntry = findMetaEntry(expected);
    actualMetaEntry = findMetaEntry(actual);

    // Compare the metaalerts directly: they can mess with comparison because of float scores.
    if (!metaAlertDocumentEquals(expectedMetaEntry.getKey(), actualMetaEntry.getKey())) {
      return false;
    } else {
      // Remove the potentially problematic metaalert comparison.
      return removeMetaEntry(expected).equals(removeMetaEntry(actual));
    }
  }

  protected Entry<Document, Optional<String>> findMetaEntry(
      Map<Document, Optional<String>> expected) {
    for (Entry<Document, Optional<String>> entry : expected.entrySet()) {
      if (entry.getKey().getSensorType().equals(METAALERT_TYPE)) {
        return entry;
      }
    }
    return null;
  }

  // Unfortunately, the floating point comparison problem prevents direct remove call.
  protected Map<Document, Optional<String>> removeMetaEntry(
      Map<Document, Optional<String>> updates) {
    Map<Document, Optional<String>> filteredUpdates = new HashMap<>();
    for (Entry<Document, Optional<String>> entry : updates.entrySet()) {
      if (!(entry.getKey().getSensorType().equals(METAALERT_TYPE))) {
        filteredUpdates.put(entry.getKey(), entry.getValue());
      }
    }
    return filteredUpdates;
  }


  // Utility method to ensure that the floating point values contained in a metaalert don't get
  // incorrectly evaluated as not equal.
  private boolean metaAlertDocumentEquals(Document expected, Document actual) {
    if (!expected.getGuid().equals(actual.getGuid())) {
      return false;
    }
    if (!expected.getSensorType().equals(actual.getSensorType())) {
      return false;
    }
    if (!expected.getTimestamp().equals(actual.getTimestamp())) {
      return false;
    }

    // The underlying documents have to be compared more thoroughly since it has floating point
    Map<String, Object> expectedDocument = expected.getDocument();
    Map<String, Object> actualDocument = actual.getDocument();

    if (expectedDocument.size() != actualDocument.size()) {
      return false;
    }

    for (Entry<String, Object> entry : expectedDocument.entrySet()) {
      Object value = entry.getValue();
      Object actualValue = actual.getDocument().get(entry.getKey());
      if (value instanceof Float) {
        if (!MathUtils.equals((Float) value, (Float) actualValue, EPS)) {
          return false;
        }
      } else if (value instanceof Double) {
        if (!MathUtils.equals((Double) value, (Double) actualValue, EPS)) {
          return false;
        }
      } else {
        if (!value.equals(actual.getDocument().get(entry.getKey()))) {
          return false;
        }
      }
    }

    return true;
  }

  // Generate some child alerts.
  protected List<Document> buildChildAlerts(int num, String parent, String guidPrefix) {
    String prefix = guidPrefix != null ? guidPrefix : DEFAULT_PREFIX;
    List<Document> alerts = new ArrayList<>();
    for (int i = 0; i < num; i++) {
      HashMap<String, Object> fields = new HashMap<>();
      fields.put(Constants.GUID, prefix + i);
      fields.put(THREAT_FIELD_DEFAULT, 0.0f);
      if (parent != null) {
        fields.put(METAALERT_FIELD, Collections.singletonList(parent));
      } else {
        fields.put(METAALERT_FIELD, new ArrayList<>());
      }
      alerts.add(new Document(fields, prefix + i, "test", 0L));
    }
    return alerts;
  }

  protected List<Map<String, Object>> getRawMaps(List<Document> documents) {
    List<Map<String, Object>> rawMaps = new ArrayList<>();
    for (Document document : documents) {
      rawMaps.add(document.getDocument());
    }
    return rawMaps;
  }

  protected Document buildMetaAlert(List<Document> alerts) {
    Map<String, Object> metaAlertMap = new HashMap<>();
    metaAlertMap.put(ALERT_FIELD, getRawMaps(alerts));
    metaAlertMap.put(Constants.GUID, METAALERT_GUID);
    return new Document(
        metaAlertMap,
        METAALERT_GUID,
        METAALERT_TYPE,
        0L
    );
  }
}