        let patStart = new RegExp(/^( )*public( )+String( )+toString/);
        let patEnd = new RegExp(/^( )*}/);
        let start: number = 0;
        let end: number = 0;
        let text = 'package test; \n\
public class Value {\n\
    Value() {} \n\
    private final long aaaa = 5L;\n\
    private long clientId;\n\
    private Integer num;\n\
    private final String orderNo = \'1\';\n\
    private String matchTime;\n\
    public void fun() {}\n\
    public  String    toString()  {\n\
        return "{" +\n\
            "tradeDate=\'" + this.tradeDate + "\'" +\n\
            ",clientId=\'" + this.clientId + "\'" + \n\
            "}";\n\
    }';
        let lines = text.split('\n');
        console.log(text);
        for (let i = 0; i < lines.length; i++) {
            if (start === 0) {
                if (lines[i].search(patStart) !== -1) {
                    start = i;
                    continue;
                }
            }
            if (start > 0) {
                if (lines[i].search(patEnd) !== -1) {
                    end = i;
                    break;
                }
            }
        }
        console.log('start=' + start + ' end=' + end);