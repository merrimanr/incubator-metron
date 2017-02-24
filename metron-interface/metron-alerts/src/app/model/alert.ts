export class Alert {
    score: number;
    description: string;
    alertId: string;
    age: string;
    alertSource: string;
    sourceIp: string;
    sourceLocation: string;
    destinationIP: string;
    designatedHost: string;
    status: string;

    destinationLocation: string;
    destinationIp: string;
    ip_dst_port_s: string;
    tcpwindow_s: string;
    protocol_s: string;
    ip_dst_addr_s: string;
    threatScore: string;
    tos_s: string;
    id_s: string;
    ip_src_addr_s: string;
    timestamp_l: string;
    ethdst_s: string;
    is_alert_s: string;
    ttl_s: string;
    sourcetype_s: string;
    ethlen_s: string;
    iplen_s: string;
    ip_src_port_s: string;
    tcpflags_s: string;
    sig_id_s: string;
    sig_generator_s: string;
    _version_: string;

    constructor(score:number, description:string, alertId:string, age:string, alertSource:string, sourceIp:string,
                sourceLocation:string, destinationIP:string, designatedHost:string, status:string) {
        this.score = score;
        this.description = description;
        this.alertId = alertId;
        this.age = age;
        this.alertSource = alertSource;
        this.sourceIp = sourceIp;
        this.sourceLocation = sourceLocation;
        this.destinationIP = destinationIP;
        this.designatedHost = designatedHost;
        this.status = status;

        this.destinationLocation  = 'Los Angeles, CA';
        this.destinationIp        = '122.28.59.234';
        this.ip_dst_port_s        = '22';
        this.tcpwindow_s          = '0x2000';
        this.protocol_s           = 'TCP';
        this.ip_dst_addr_s        = '192.168.66.121';
        this.threatScore          = '85';
        this.tos_s                = '16';
        this.id_s                 = '20455';
        this.ip_src_addr_s        = '192.168.66.1';
        this.timestamp_l          = '1465332702518';
        this.ethdst_s             = '08:00:27:12:E2:63';
        this.is_alert_s           = 'true';
        this.ttl_s                = '64';
        this.sourcetype_s         = 'snort';
        this.ethlen_s             = '0x72';
        this.iplen_s              = '102400';
        this.ip_src_port_s        = '62464';
        this.tcpflags_s           = '***AP***';
        this.sig_id_s             = '12';
        this.sig_generator_s      = '129';
        this._version_            = '153651280996938';
    }

    public static getData() {
        return [
            new Alert(85,  'Threat Intel - IP from Ireland',     '234', '1 hour ago',   'Bro',        '10.23.41.123', 'Los Angeles, CA USA',      '10.23.41.123', 'x230-12811',     'New'),
            new Alert(85,  'Velocity Access - Ireland to USA',   '342', '11 hours ago', 'FireEye',    '10.23.41.123', 'Los Angeles, CA USA',      '10.23.41.123', 'x230-34221',     'Open'),
            new Alert(70,  'Anomaly - Gmail Activity',           '432', '2 hours ago',  'Metron',     '10.23.41.123', 'Limerick, Ireland',        '10.23.41.123', 'ww-staff-wp1',   'Open'),
            new Alert(50,  'Anomaly - Port scan',                '123', '4 hours ago',  'Fire Eye',   '10.23.41.123', 'Limerick, Ireland',        '10.23.41.123', 'x230-23311',     'New'),
            new Alert(50,  'Beaconing Host: 122.28.59.234',      '125', '11 hours ago', 'Bro',        '10.23.41.123', 'Limerick, Ireland',        '10.23.41.123', 'ww-staff-wp1',   'New'),
            new Alert(50,  'Failed Login',                       '126', '2 hours ago',  'Snort',      '10.23.41.123', 'Los Angeles, CA USA',      '10.23.41.123', 'x230-32122',     'New'),
            new Alert(50,  'Angler EK Flash Exploit M2',         '153', '4 hours ago',  'Metron',     '10.23.41.123', 'Limerick, Ireland',        '10.23.41.123', 'x230-45545',     'New'),
            new Alert(45,  'Anomaly - Port scan',                '184', '7 hours ago',  'Fire Eye',   '10.23.41.123', 'Limerick, Ireland',        '10.23.41.123', 'ww-staff-wp1',   'New'),
            new Alert(45,  'Targeted Host: 10.1.163.155',        '134', '2 days ago',   'Bro',        '10.23.41.123', 'Los Angeles, CA USA',      '10.23.41.123', 'x230-34432',     'New'),
            new Alert(45,  'Beaconing Host: 10.1.163.155',       '178', '8 hours ago',  'Snort',      '10.23.41.123', 'Limerick, Ireland',        '10.23.41.123', 'x230-23311',     'New'),
            new Alert(45,  'Anomaly - Port scan',                '137', '1 day ago',    'Bro',        '10.23.41.123', 'Los Angeles, CA USA',      '10.23.41.123', 'ww-staff-wp1',   'New'),
            new Alert(45,  'Failed Login',                       '174', '2 days ago ',  'Snort',      '10.23.41.123', 'Los Angeles, CA USA',      '10.23.41.123', 'x230-32122',     'New'),
            new Alert(45,  'Targeted Host: 10.1.163.17',         '193', '4 hours ago',  'Metron',     '10.23.41.123', 'Los Angeles, CA USA',      '10.23.41.123', 'ww-staff-wp1',   'New'),
            new Alert(45,  'Beaconing Host: 10.1.163.12',        '113', '7 hours ago',  'Fire Eye',   '10.23.41.123', 'Los Angeles, CA USA',      '10.23.41.123', 'x230-32122',     'New'),
            new Alert(40,  'Anomaly - Port scan',                '117', '2 days ago ',  'Yaf',        '10.23.41.123', 'Los Angeles, CA USA',      '10.23.41.123', 'x230-45545',     'New'),
            new Alert(40,  'Failed Login',                       '114', '8 hours ago',  'Fire Eye',   '10.23.41.123', 'Limerick, Ireland',        '10.23.41.123', 'ww-staff-wp1',   'New'),
            new Alert(34,  'Anomaly - Port scan',                '115', '7 hours ago',  'Metron',     '10.23.41.123', 'Los Angeles, CA USA',      '10.23.41.123', 'x230-34432',     'New')
        ];
    }
}