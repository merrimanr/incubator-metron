Blockly.JavaScript['stellar_IS_DATE'] = function(block) {
    var value_date = Blockly.JavaScript.valueToCode(block, 'DATE', Blockly.JavaScript.ORDER_ADDITION);
    var value_format = Blockly.JavaScript.valueToCode(block, 'FORMAT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'IS_DATE(' + value_date + ',' + value_format + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_IS_DOMAIN'] = function(block) {
    var value_address = Blockly.JavaScript.valueToCode(block, 'ADDRESS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'IS_DOMAIN(' + value_address + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_MONTH'] = function(block) {
    var value_dateTime = Blockly.JavaScript.valueToCode(block, 'DATETIME', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'MONTH(' + value_dateTime + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_TRIM'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'TRIM(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_WEEK_OF_MONTH'] = function(block) {
    var value_dateTime = Blockly.JavaScript.valueToCode(block, 'DATETIME', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'WEEK_OF_MONTH(' + value_dateTime + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_JOIN'] = function(block) {
    var value_list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_ADDITION);
    var value_delim = Blockly.JavaScript.valueToCode(block, 'DELIM', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'JOIN(' + value_list + ',' + value_delim + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_MAP_GET'] = function(block) {
    var value_key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ADDITION);
    var value_map = Blockly.JavaScript.valueToCode(block, 'MAP', Blockly.JavaScript.ORDER_ADDITION);
    var value_default = Blockly.JavaScript.valueToCode(block, 'DEFAULT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'MAP_GET(' + value_key + ',' + value_map + ',' + value_default + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_TO_INTEGER'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'TO_INTEGER(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_YEAR'] = function(block) {
    var value_dateTime = Blockly.JavaScript.valueToCode(block, 'DATETIME', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'YEAR(' + value_dateTime + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_OUTLIER_MAD_SCORE'] = function(block) {
    var value_state = Blockly.JavaScript.valueToCode(block, 'STATE', Blockly.JavaScript.ORDER_ADDITION);
    var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ADDITION);
    var value_scale = Blockly.JavaScript.valueToCode(block, 'SCALE', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'OUTLIER_MAD_SCORE(' + value_state + ',' + value_value + ',' + value_scale + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_WEEK_OF_YEAR'] = function(block) {
    var value_dateTime = Blockly.JavaScript.valueToCode(block, 'DATETIME', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'WEEK_OF_YEAR(' + value_dateTime + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_PROTOCOL_TO_NAME'] = function(block) {
    var value_IANA = Blockly.JavaScript.valueToCode(block, 'IANA', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'PROTOCOL_TO_NAME(' + value_IANA + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_ENDS_WITH'] = function(block) {
    var value_string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ADDITION);
    var value_suffix = Blockly.JavaScript.valueToCode(block, 'SUFFIX', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'ENDS_WITH(' + value_string + ',' + value_suffix + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_GET_FIRST'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'GET_FIRST(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_MAX'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_MAX(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_DOMAIN_TO_TLD'] = function(block) {
    var value_domain = Blockly.JavaScript.valueToCode(block, 'DOMAIN', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'DOMAIN_TO_TLD(' + value_domain + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_TO_STRING'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'TO_STRING(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_DOMAIN_REMOVE_SUBDOMAINS'] = function(block) {
    var value_domain = Blockly.JavaScript.valueToCode(block, 'DOMAIN', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'DOMAIN_REMOVE_SUBDOMAINS(' + value_domain + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STARTS_WITH'] = function(block) {
    var value_string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ADDITION);
    var value_prefix = Blockly.JavaScript.valueToCode(block, 'PREFIX', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STARTS_WITH(' + value_string + ',' + value_prefix + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_BLOOM_MERGE'] = function(block) {
    var value_bloomfilters = Blockly.JavaScript.valueToCode(block, 'BLOOMFILTERS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'BLOOM_MERGE(' + value_bloomfilters + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_KURTOSIS'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_KURTOSIS(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_DOMAIN_REMOVE_TLD'] = function(block) {
    var value_domain = Blockly.JavaScript.valueToCode(block, 'DOMAIN', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'DOMAIN_REMOVE_TLD(' + value_domain + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_SUM_SQUARES'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_SUM_SQUARES(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_INIT'] = function(block) {
    var value_window_size = Blockly.JavaScript.valueToCode(block, 'WINDOW_SIZE', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_INIT(' + value_window_size + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_ENRICHMENT_GET'] = function(block) {
    var value_enrichment_type = Blockly.JavaScript.valueToCode(block, 'ENRICHMENT_TYPE', Blockly.JavaScript.ORDER_ADDITION);
    var value_indicator = Blockly.JavaScript.valueToCode(block, 'INDICATOR', Blockly.JavaScript.ORDER_ADDITION);
    var value_nosql_table = Blockly.JavaScript.valueToCode(block, 'NOSQL_TABLE', Blockly.JavaScript.ORDER_ADDITION);
    var value_column_family = Blockly.JavaScript.valueToCode(block, 'COLUMN_FAMILY', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'ENRICHMENT_GET(' + value_enrichment_type + ',' + value_indicator + ',' + value_nosql_table + ',' + value_column_family + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_SYSTEM_ENV_GET'] = function(block) {
    var value_env_var = Blockly.JavaScript.valueToCode(block, 'ENV_VAR', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'SYSTEM_ENV_GET(' + value_env_var + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_SD'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_SD(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_COUNT'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_COUNT(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_GET'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var value_i = Blockly.JavaScript.valueToCode(block, 'I', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'GET(' + value_input + ',' + value_i + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_IS_INTEGER'] = function(block) {
    var value_x = Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'IS_INTEGER(' + value_x + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_DAY_OF_WEEK'] = function(block) {
    var value_dateTime = Blockly.JavaScript.valueToCode(block, 'DATETIME', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'DAY_OF_WEEK(' + value_dateTime + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_IS_EMPTY'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'IS_EMPTY(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_IS_EMAIL'] = function(block) {
    var value_address = Blockly.JavaScript.valueToCode(block, 'ADDRESS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'IS_EMAIL(' + value_address + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_MAP_EXISTS'] = function(block) {
    var value_key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ADDITION);
    var value_map = Blockly.JavaScript.valueToCode(block, 'MAP', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'MAP_EXISTS(' + value_key + ',' + value_map + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_DAY_OF_YEAR'] = function(block) {
    var value_dateTime = Blockly.JavaScript.valueToCode(block, 'DATETIME', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'DAY_OF_YEAR(' + value_dateTime + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_REGEXP_MATCH'] = function(block) {
    var value_string = Blockly.JavaScript.valueToCode(block, 'STRING', Blockly.JavaScript.ORDER_ADDITION);
    var value_pattern = Blockly.JavaScript.valueToCode(block, 'PATTERN', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'REGEXP_MATCH(' + value_string + ',' + value_pattern + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_TO_LOWER'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'TO_LOWER(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_SKEWNESS'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_SKEWNESS(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_ENRICHMENT_EXISTS'] = function(block) {
    var value_enrichment_type = Blockly.JavaScript.valueToCode(block, 'ENRICHMENT_TYPE', Blockly.JavaScript.ORDER_ADDITION);
    var value_indicator = Blockly.JavaScript.valueToCode(block, 'INDICATOR', Blockly.JavaScript.ORDER_ADDITION);
    var value_nosql_table = Blockly.JavaScript.valueToCode(block, 'NOSQL_TABLE', Blockly.JavaScript.ORDER_ADDITION);
    var value_column_family = Blockly.JavaScript.valueToCode(block, 'COLUMN_FAMILY', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'ENRICHMENT_EXISTS(' + value_enrichment_type + ',' + value_indicator + ',' + value_nosql_table + ',' + value_column_family + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_URL_TO_PORT'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'URL_TO_PORT(' + value_url + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_DAY_OF_MONTH'] = function(block) {
    var value_dateTime = Blockly.JavaScript.valueToCode(block, 'DATETIME', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'DAY_OF_MONTH(' + value_dateTime + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_LENGTH'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'LENGTH(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_GET_LAST'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'GET_LAST(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_IN_SUBNET'] = function(block) {
    var value_ip = Blockly.JavaScript.valueToCode(block, 'IP', Blockly.JavaScript.ORDER_ADDITION);
    var value_cidr = Blockly.JavaScript.valueToCode(block, 'CIDR', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'IN_SUBNET(' + value_ip + ',' + value_cidr + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_SPLIT'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var value_delim = Blockly.JavaScript.valueToCode(block, 'DELIM', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'SPLIT(' + value_input + ',' + value_delim + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_MAAS_MODEL_APPLY'] = function(block) {
    var value_endpoint = Blockly.JavaScript.valueToCode(block, 'ENDPOINT', Blockly.JavaScript.ORDER_ADDITION);
    var value_function = Blockly.JavaScript.valueToCode(block, 'FUNCTION', Blockly.JavaScript.ORDER_ADDITION);
    var value_model_args = Blockly.JavaScript.valueToCode(block, 'MODEL_ARGS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'MAAS_MODEL_APPLY(' + value_endpoint + ',' + value_function + ',' + value_model_args + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_ABS'] = function(block) {
    var value_number = Blockly.JavaScript.valueToCode(block, 'NUMBER', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'ABS(' + value_number + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_POPULATION_VARIANCE'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_POPULATION_VARIANCE(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_SYSTEM_PROPERTY_GET'] = function(block) {
    var value_key = Blockly.JavaScript.valueToCode(block, 'KEY', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'SYSTEM_PROPERTY_GET(' + value_key + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_VARIANCE'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_VARIANCE(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_ADD'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_ADD(' + value_stats + ',' + value_value + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_TO_UPPER'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'TO_UPPER(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_OUTLIER_MAD_STATE_MERGE'] = function(block) {
    var value_state = Blockly.JavaScript.valueToCode(block, 'STATE', Blockly.JavaScript.ORDER_ADDITION);
    var value_currentState = Blockly.JavaScript.valueToCode(block, 'CURRENTSTATE', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'OUTLIER_MAD_STATE_MERGE(' + value_state + ',' + value_currentState + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_TO_EPOCH_TIMESTAMP'] = function(block) {
    var value_dateTime = Blockly.JavaScript.valueToCode(block, 'DATETIME', Blockly.JavaScript.ORDER_ADDITION);
    var value_format = Blockly.JavaScript.valueToCode(block, 'FORMAT', Blockly.JavaScript.ORDER_ADDITION);
    var value_timezone = Blockly.JavaScript.valueToCode(block, 'TIMEZONE', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'TO_EPOCH_TIMESTAMP(' + value_dateTime + ',' + value_format + ',' + value_timezone + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_MAAS_GET_ENDPOINT'] = function(block) {
    var value_model_name = Blockly.JavaScript.valueToCode(block, 'MODEL_NAME', Blockly.JavaScript.ORDER_ADDITION);
    var value_model_version = Blockly.JavaScript.valueToCode(block, 'MODEL_VERSION', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'MAAS_GET_ENDPOINT(' + value_model_name + ',' + value_model_version + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_BLOOM_EXISTS'] = function(block) {
    var value_bloom = Blockly.JavaScript.valueToCode(block, 'BLOOM', Blockly.JavaScript.ORDER_ADDITION);
    var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'BLOOM_EXISTS(' + value_bloom + ',' + value_value + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_BLOOM_INIT'] = function(block) {
    var value_expectedInsertions = Blockly.JavaScript.valueToCode(block, 'EXPECTEDINSERTIONS', Blockly.JavaScript.ORDER_ADDITION);
    var value_falsePositiveRate = Blockly.JavaScript.valueToCode(block, 'FALSEPOSITIVERATE', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'BLOOM_INIT(' + value_expectedInsertions + ',' + value_falsePositiveRate + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_BLOOM_ADD'] = function(block) {
    var value_bloom = Blockly.JavaScript.valueToCode(block, 'BLOOM', Blockly.JavaScript.ORDER_ADDITION);
    var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'BLOOM_ADD(' + value_bloom + ',' + value_value + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_QUADRATIC_MEAN'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_QUADRATIC_MEAN(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_URL_TO_PATH'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'URL_TO_PATH(' + value_url + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_GEOMETRIC_MEAN'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_GEOMETRIC_MEAN(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_OUTLIER_MAD_ADD'] = function(block) {
    var value_state = Blockly.JavaScript.valueToCode(block, 'STATE', Blockly.JavaScript.ORDER_ADDITION);
    var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'OUTLIER_MAD_ADD(' + value_state + ',' + value_value + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_URL_TO_PROTOCOL'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'URL_TO_PROTOCOL(' + value_url + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_MIN'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_MIN(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_URL_TO_HOST'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'URL_TO_HOST(' + value_url + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_SUM_LOGS'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_SUM_LOGS(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_IS_URL'] = function(block) {
    var value_url = Blockly.JavaScript.valueToCode(block, 'URL', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'IS_URL(' + value_url + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_SUM'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_SUM(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_IS_IP'] = function(block) {
    var value_ip = Blockly.JavaScript.valueToCode(block, 'IP', Blockly.JavaScript.ORDER_ADDITION);
    var value_type = Blockly.JavaScript.valueToCode(block, 'TYPE', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'IS_IP(' + value_ip + ',' + value_type + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_TO_LONG'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'TO_LONG(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_MEAN'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_MEAN(' + value_stats + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_MERGE'] = function(block) {
    var value_statistics = Blockly.JavaScript.valueToCode(block, 'STATISTICS', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_MERGE(' + value_statistics + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_STATS_PERCENTILE'] = function(block) {
    var value_stats = Blockly.JavaScript.valueToCode(block, 'STATS', Blockly.JavaScript.ORDER_ADDITION);
    var value_p = Blockly.JavaScript.valueToCode(block, 'P', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'STATS_PERCENTILE(' + value_stats + ',' + value_p + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_TO_DOUBLE'] = function(block) {
    var value_input = Blockly.JavaScript.valueToCode(block, 'INPUT', Blockly.JavaScript.ORDER_ADDITION);
    var code = 'TO_DOUBLE(' + value_input + ')';
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['available_fields'] = function(block) {
    var dropdown_name = block.getFieldValue('FIELD_NAME');
    var code = dropdown_name;
    return [code, Blockly.JavaScript.ORDER_ADDITION];
};
Blockly.JavaScript['stellar_and'] = function(block) {
    var arguments = [];
    for (var i = 1; i < block.inputList.length - 1; i++) {
        arguments[i - 1] = Blockly.JavaScript.valueToCode(block, block.inputList[i].name, Blockly.JavaScript.ORDER_ADDITION);
    }
    if (block.getFieldValue('OP') == 'OR') {
        return [arguments.join(' || '), Blockly.JavaScript.ORDER_LOGICAL_OR];
    } else {
        return [arguments.join(' && '), Blockly.JavaScript.ORDER_LOGICAL_AND];
    }
};