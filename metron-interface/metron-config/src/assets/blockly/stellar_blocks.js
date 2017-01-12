'use strict';

goog.provide('Blockly.Blocks.colour');

goog.require('Blockly.Blocks');

Blockly.Blocks['stellar_IS_DATE'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("IS_DATE");
        this.appendValueInput("DATE")
            .setCheck(null)
            .appendField("date");
        this.appendValueInput("FORMAT")
            .setCheck(null)
            .appendField("format");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_MONTH'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("MONTH");
        this.appendValueInput("DATETIME")
            .setCheck(null)
            .appendField("dateTime");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_IS_DOMAIN'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("IS_DOMAIN");
        this.appendValueInput("ADDRESS")
            .setCheck(null)
            .appendField("address");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_TRIM'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("TRIM");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_WEEK_OF_MONTH'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("WEEK_OF_MONTH");
        this.appendValueInput("DATETIME")
            .setCheck(null)
            .appendField("dateTime");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_JOIN'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("JOIN");
        this.appendValueInput("LIST")
            .setCheck(null)
            .appendField("list");
        this.appendValueInput("DELIM")
            .setCheck(null)
            .appendField("delim");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_MAP_GET'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("MAP_GET");
        this.appendValueInput("KEY")
            .setCheck(null)
            .appendField("key");
        this.appendValueInput("MAP")
            .setCheck(null)
            .appendField("map");
        this.appendValueInput("DEFAULT")
            .setCheck(null)
            .appendField("default");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_TO_INTEGER'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("TO_INTEGER");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_WEEK_OF_YEAR'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("WEEK_OF_YEAR");
        this.appendValueInput("DATETIME")
            .setCheck(null)
            .appendField("dateTime");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_YEAR'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("YEAR");
        this.appendValueInput("DATETIME")
            .setCheck(null)
            .appendField("dateTime");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_OUTLIER_MAD_SCORE'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("OUTLIER_MAD_SCORE");
        this.appendValueInput("STATE")
            .setCheck(null)
            .appendField("state");
        this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField("value");
        this.appendValueInput("SCALE")
            .setCheck(null)
            .appendField("scale");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_PROTOCOL_TO_NAME'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("PROTOCOL_TO_NAME");
        this.appendValueInput("IANA")
            .setCheck(null)
            .appendField("IANA");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_ENDS_WITH'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("ENDS_WITH");
        this.appendValueInput("STRING")
            .setCheck(null)
            .appendField("string");
        this.appendValueInput("SUFFIX")
            .setCheck(null)
            .appendField("suffix");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_GET_FIRST'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("GET_FIRST");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_DOMAIN_TO_TLD'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DOMAIN_TO_TLD");
        this.appendValueInput("DOMAIN")
            .setCheck(null)
            .appendField("domain");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_MAX'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_MAX");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_TO_STRING'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("TO_STRING");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_DOMAIN_REMOVE_SUBDOMAINS'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DOMAIN_REMOVE_SUBDOMAINS");
        this.appendValueInput("DOMAIN")
            .setCheck(null)
            .appendField("domain");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STARTS_WITH'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STARTS_WITH");
        this.appendValueInput("STRING")
            .setCheck(null)
            .appendField("string");
        this.appendValueInput("PREFIX")
            .setCheck(null)
            .appendField("prefix");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_BLOOM_MERGE'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("BLOOM_MERGE");
        this.appendValueInput("BLOOMFILTERS")
            .setCheck(null)
            .appendField("bloomfilters");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_KURTOSIS'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_KURTOSIS");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_DOMAIN_REMOVE_TLD'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DOMAIN_REMOVE_TLD");
        this.appendValueInput("DOMAIN")
            .setCheck(null)
            .appendField("domain");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_SUM_SQUARES'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_SUM_SQUARES");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_INIT'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_INIT");
        this.appendValueInput("WINDOW_SIZE")
            .setCheck(null)
            .appendField("window_size");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_ENRICHMENT_GET'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("ENRICHMENT_GET");
        this.appendValueInput("ENRICHMENT_TYPE")
            .setCheck(null)
            .appendField("enrichment_type");
        this.appendValueInput("INDICATOR")
            .setCheck(null)
            .appendField("indicator");
        this.appendValueInput("NOSQL_TABLE")
            .setCheck(null)
            .appendField("nosql_table");
        this.appendValueInput("COLUMN_FAMILY")
            .setCheck(null)
            .appendField("column_family");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_SYSTEM_ENV_GET'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("SYSTEM_ENV_GET");
        this.appendValueInput("ENV_VAR")
            .setCheck(null)
            .appendField("env_var");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_SD'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_SD");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_COUNT'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_COUNT");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_GET'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("GET");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.appendValueInput("I")
            .setCheck(null)
            .appendField("i");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_IS_INTEGER'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("IS_INTEGER");
        this.appendValueInput("X")
            .setCheck(null)
            .appendField("x");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_DAY_OF_WEEK'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DAY_OF_WEEK");
        this.appendValueInput("DATETIME")
            .setCheck(null)
            .appendField("dateTime");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_IS_EMPTY'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("IS_EMPTY");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_IS_EMAIL'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("IS_EMAIL");
        this.appendValueInput("ADDRESS")
            .setCheck(null)
            .appendField("address");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_MAP_EXISTS'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("MAP_EXISTS");
        this.appendValueInput("KEY")
            .setCheck(null)
            .appendField("key");
        this.appendValueInput("MAP")
            .setCheck(null)
            .appendField("map");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_DAY_OF_YEAR'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DAY_OF_YEAR");
        this.appendValueInput("DATETIME")
            .setCheck(null)
            .appendField("dateTime");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_REGEXP_MATCH'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("REGEXP_MATCH");
        this.appendValueInput("STRING")
            .setCheck(null)
            .appendField("string");
        this.appendValueInput("PATTERN")
            .setCheck(null)
            .appendField("pattern");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_TO_LOWER'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("TO_LOWER");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_SKEWNESS'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_SKEWNESS");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_ENRICHMENT_EXISTS'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("ENRICHMENT_EXISTS");
        this.appendValueInput("ENRICHMENT_TYPE")
            .setCheck(null)
            .appendField("enrichment_type");
        this.appendValueInput("INDICATOR")
            .setCheck(null)
            .appendField("indicator");
        this.appendValueInput("NOSQL_TABLE")
            .setCheck(null)
            .appendField("nosql_table");
        this.appendValueInput("COLUMN_FAMILY")
            .setCheck(null)
            .appendField("column_family");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_URL_TO_PORT'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("URL_TO_PORT");
        this.appendValueInput("URL")
            .setCheck(null)
            .appendField("url");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_DAY_OF_MONTH'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("DAY_OF_MONTH");
        this.appendValueInput("DATETIME")
            .setCheck(null)
            .appendField("dateTime");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_LENGTH'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("LENGTH");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_IN_SUBNET'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("IN_SUBNET");
        this.appendValueInput("IP")
            .setCheck(null)
            .appendField("ip");
        this.appendValueInput("CIDR")
            .setCheck(null)
            .appendField("cidr");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_GET_LAST'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("GET_LAST");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_SPLIT'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("SPLIT");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.appendValueInput("DELIM")
            .setCheck(null)
            .appendField("delim");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_MAAS_MODEL_APPLY'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("MAAS_MODEL_APPLY");
        this.appendValueInput("ENDPOINT")
            .setCheck(null)
            .appendField("endpoint");
        this.appendValueInput("FUNCTION")
            .setCheck(null)
            .appendField("function");
        this.appendValueInput("MODEL_ARGS")
            .setCheck(null)
            .appendField("model_args");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_ABS'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("ABS");
        this.appendValueInput("NUMBER")
            .setCheck(null)
            .appendField("number");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_POPULATION_VARIANCE'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_POPULATION_VARIANCE");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_SYSTEM_PROPERTY_GET'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("SYSTEM_PROPERTY_GET");
        this.appendValueInput("KEY")
            .setCheck(null)
            .appendField("key");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_VARIANCE'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_VARIANCE");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_ADD'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_ADD");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField("value");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_TO_UPPER'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("TO_UPPER");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_OUTLIER_MAD_STATE_MERGE'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("OUTLIER_MAD_STATE_MERGE");
        this.appendValueInput("STATE")
            .setCheck(null)
            .appendField("state");
        this.appendValueInput("CURRENTSTATE")
            .setCheck(null)
            .appendField("currentState");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_TO_EPOCH_TIMESTAMP'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("TO_EPOCH_TIMESTAMP");
        this.appendValueInput("DATETIME")
            .setCheck(null)
            .appendField("dateTime");
        this.appendValueInput("FORMAT")
            .setCheck(null)
            .appendField("format");
        this.appendValueInput("TIMEZONE")
            .setCheck(null)
            .appendField("timezone");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_MAAS_GET_ENDPOINT'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("MAAS_GET_ENDPOINT");
        this.appendValueInput("MODEL_NAME")
            .setCheck(null)
            .appendField("model_name");
        this.appendValueInput("MODEL_VERSION")
            .setCheck(null)
            .appendField("model_version");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_BLOOM_EXISTS'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("BLOOM_EXISTS");
        this.appendValueInput("BLOOM")
            .setCheck(null)
            .appendField("bloom");
        this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField("value");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_QUADRATIC_MEAN'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_QUADRATIC_MEAN");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_BLOOM_INIT'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("BLOOM_INIT");
        this.appendValueInput("EXPECTEDINSERTIONS")
            .setCheck(null)
            .appendField("expectedInsertions");
        this.appendValueInput("FALSEPOSITIVERATE")
            .setCheck(null)
            .appendField("falsePositiveRate");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_BLOOM_ADD'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("BLOOM_ADD");
        this.appendValueInput("BLOOM")
            .setCheck(null)
            .appendField("bloom");
        this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField("value");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_URL_TO_PATH'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("URL_TO_PATH");
        this.appendValueInput("URL")
            .setCheck(null)
            .appendField("url");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_GEOMETRIC_MEAN'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_GEOMETRIC_MEAN");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_OUTLIER_MAD_ADD'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("OUTLIER_MAD_ADD");
        this.appendValueInput("STATE")
            .setCheck(null)
            .appendField("state");
        this.appendValueInput("VALUE")
            .setCheck(null)
            .appendField("value");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_URL_TO_PROTOCOL'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("URL_TO_PROTOCOL");
        this.appendValueInput("URL")
            .setCheck(null)
            .appendField("url");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_MIN'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_MIN");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_URL_TO_HOST'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("URL_TO_HOST");
        this.appendValueInput("URL")
            .setCheck(null)
            .appendField("url");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_SUM_LOGS'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_SUM_LOGS");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_IS_URL'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("IS_URL");
        this.appendValueInput("URL")
            .setCheck(null)
            .appendField("url");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_SUM'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_SUM");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_IS_IP'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("IS_IP");
        this.appendValueInput("IP")
            .setCheck(null)
            .appendField("ip");
        this.appendValueInput("TYPE")
            .setCheck(null)
            .appendField("type");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_TO_LONG'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("TO_LONG");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_MEAN'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_MEAN");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_MERGE'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_MERGE");
        this.appendValueInput("STATISTICS")
            .setCheck(null)
            .appendField("statistics");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_STATS_PERCENTILE'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("STATS_PERCENTILE");
        this.appendValueInput("STATS")
            .setCheck(null)
            .appendField("stats");
        this.appendValueInput("P")
            .setCheck(null)
            .appendField("p");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stellar_TO_DOUBLE'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("TO_DOUBLE");
        this.appendValueInput("INPUT")
            .setCheck(null)
            .appendField("input");
        this.setOutput(true, null);
        this.setColour(160);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

// Blockly.Blocks['available_fields'] = {
//     init: function() {
//         this.appendDummyInput()
//             .appendField(new Blockly.FieldDropdown([["sensor_type", "sensor_type"], ["ip_src_addr", "ip_src_addr"], ["ip_dst_addr", "ip_dst_addr"]]), "FIELD_NAME");
//         this.setOutput(true, "String");
//         this.setTooltip('These are the available fields');
//         this.setHelpUrl('http://www.example.com/');
//         this.setColour(270);
//     }
// };

Blockly.Blocks['stellar_and'] = {
    init: function() {
        var OPERATORS =
            [[Blockly.Msg.LOGIC_OPERATION_AND, 'AND'],
                [Blockly.Msg.LOGIC_OPERATION_OR, 'OR']];
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
        this.appendValueInput("ARG1")
            .setCheck('Boolean');
        this.setOutput(true, "Boolean");
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
        this.setColour(50);
    },
    onchange: function(changeEvent) {
        if (changeEvent.newParentId == this.id) {
            var numFields = this.inputList.length - 1;
            this.appendValueInput('ARG' + (numFields + 1))
                .setCheck('Boolean');
        }
        if (changeEvent.oldParentId == this.id) {
            this.removeInput(this.inputList[this.inputList.length - 1].name);
            this.moveInputBefore(changeEvent.oldInputName, null);
            for(var j = 1; j < this.inputList.length; j++) {
                this.inputList[j].name = 'ARG' + j;
            }
        }
    },
    domToMutation: function(xmlElement) {
        console.log(xmlElement);
    }
};

Blockly.Blocks['stellar_arithmetic'] = {
    /**
     * Block for basic arithmetic operator.
     * @this Blockly.Block
     */
    init: function() {
        this.jsonInit({
            "message0": "%1 %2 %3",
            "args0": [
                {
                    "type": "input_value",
                    "name": "A"
                   // "check": "Number"
                },
                {
                    "type": "field_dropdown",
                    "name": "OP",
                    "options":
                        [[Blockly.Msg.MATH_ADDITION_SYMBOL, 'ADD'],
                            [Blockly.Msg.MATH_SUBTRACTION_SYMBOL, 'MINUS'],
                            [Blockly.Msg.MATH_MULTIPLICATION_SYMBOL, 'MULTIPLY'],
                            [Blockly.Msg.MATH_DIVISION_SYMBOL, 'DIVIDE']]
                },
                {
                    "type": "input_value",
                    "name": "B"
                  //  "check": "Number"
                }
            ],
            "inputsInline": true,
            "output": "Number",
            "colour": Blockly.Blocks.math.HUE,
            "helpUrl": Blockly.Msg.MATH_ARITHMETIC_HELPURL
        });
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function() {
            var mode = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                'ADD': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
                'MINUS': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
                'MULTIPLY': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
                'DIVIDE': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE
            };
            return TOOLTIPS[mode];
        });
    }
};
Blockly.Blocks['stellar_in'] = {
    /**
     * Block for finding an item in the list.
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.LISTS_INDEX_OF_HELPURL);
        this.setColour(Blockly.Blocks.lists.HUE);
        this.setOutput(true, 'Boolean');
        this.appendValueInput('INPUT');
        this.appendValueInput('LIST')
            .appendField("in")
            .setCheck('Array');
        this.setInputsInline(true);
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function() {
            return Blockly.Msg.LISTS_INDEX_OF_TOOLTIP.replace('%1',
                this.workspace.options.oneBasedIndex ? '0' : '-1');
        });
    }
};