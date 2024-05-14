//https://cdn.chipkin.com/assets/uploads/imports/resources/DNP3QuickReference.pdf
//https://www.racom.eu/eng/support/prot/dnp3/index.html
//https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Treiber_DNP3/dnp3_application_layer.html
//https://www.researchgate.net/figure/DNP3-message-architecture_fig1_308143053

function cleanInput(i){
    return i.replaceAll(" ","").replaceAll("\n","").replaceAll("0x","").toLowerCase()
}

function getInput(){
    return document.getElementById("input").value;
}

function setOutput(id,value){
    if (document.getElementById(id)==null){
        return "ID not found."
    } else{
        document.getElementById(id).value = value;
        return 1
    }
}

///////////////////
//DATA LINK LAYER//
///////////////////
function getStart(input){
    //console.log("Start: "+input)
    if (input=="0564"){
        state="valid"
    } else{
        state="invalid"
    }
    return "0x"+input + `(${state})`
}

function getLength(input){
    //console.log("Length: "+input)
    as_int = Number(input)
    return "0x"+input +`(${as_int})`
}

function getDirection(input){
    //console.log("Control (direction): "+input)
    as_int = Number("0x"+input)
    //console.log(as_int>>7 & 0x1)
    if ((as_int>>7 & 0x1) == 1){
        return("From Master to Outstation")
    } else{
        return("From Outstation to Master")
    }
}

function getPrimaryMessage(input){
    //console.log("Control (PRM): "+input)
    as_int = Number("0x"+input)
    if ((as_int>>6 & 0x01) == 1){
        return("Primary to Secondary")
    } else{
        return("Secondary to Primary")
    }
}

function getLinkFunctionCode(input){
    as_int = Number("0x"+input)
    prm=-1
    if ((as_int>>6 & 0x01) == 1){
        prm=1
    } else{
        prm=0
    }
    //console.log("Link Function Code: "+input.substring(1))
    //console.log("PRM: "+prm)
    if (prm==1){
        switch (input.substring(1)){
            case "0":
                return "RESET_LINK_STATUS";
                break;
            case "2":
                return "TEST_LINK_STATES"
                break;
            case "3":
                return "CONFIRMED_USER_DATA"
                break;
            case "4":
                return "UNCONFIRMED_USER_DATA"
                break;
            case "9":
                return "REQUEST_LINK_STATUS"
                break;
        }
    }

    if (prm==0){
        switch (input.substring(1)){
            case "0":
                return "ACK"
                break;
            case "1":
                return "NACK"
                break;
            case "B":
                return "LINK_STATUS"
                break;
            case "F":
                return "NOT_SUPPORTED"
                break;
        }
    }

}

function getDestination(input){
    //console.log("Destination: "+input)
    //swap bytes around
    input = input.substring(2) +input.substring(0,2)
    return Number("0x"+input)
}

function getSource(input){
    //console.log("Source: "+input)
    //swap bytes around
    input = input.substring(2) +input.substring(0,2)
    return Number("0x"+input)
}

function getCRC(input){
    //console.log("CRC: "+input)
    //swap bytes around
    input = input.substring(2) +input.substring(0,2)
    return "0x"+input
}

function handleDataLinkLayer(input){
    //056405C001000004E921  <-- example input
    setOutput("data-link-data",input)
    var start = input.substring(0,4)
    var length = input.substring(4,6)
    var control = input.substring(6,8)
    var destination = input.substring(8,12)
    var source = input.substring(12,16)
    var crc = input.substring(16,20)
    //console.log("Data Link Layer: "+input)
    
    setOutput("start",getStart(start))
    setOutput("length",getLength(length))
    setOutput("direction",getDirection(control))
    setOutput("prm",getPrimaryMessage(control))
    //TODO: add something for DFC
    setOutput("link_function_code",getLinkFunctionCode(control))
    setOutput("destination",getDestination(destination))
    setOutput("source",getSource(source))
    setOutput("crc",getCRC(crc))
}
///////////////////
//TRANSPORT LAYER//
///////////////////
function getFIN(input){
    as_int = Number("0x"+input)
    if ((as_int>>7 & 0x1) == 1){
        return "1"
    } else{
        return "0"
    }
}

function getFIR(input){
    as_int = Number("0x"+input)
    if ((as_int>>6 & 0x01) == 1){
        return "1"
    } else{
        return "0"
    }
}

function getSeq(input){
    as_int = Number("0x"+input)
    console.log(as_int)
    bits = (as_int & 0x1f)
    console.log(bits)
    return bits
}

function handleTransportLayer(input){
    setOutput("transport-layer-data",input)
    setOutput("fin",getFIN(input))
    setOutput("fir",getFIR(input))
    setOutput("seq",getSeq(input))

}


///////////////////////
//APPLICATION HEADER//
//////////////////////
function getApplicationControl(input){
    console.log("Application Control: "+input)
    as_int = Number("0x"+input)
    console.log("Application Control (int): "+as_int)

    setOutput("application_control_fir",(as_int & 128) == 128 ? 1 : 0)
    setOutput("application_control_fin",(as_int & 64) == 64 ? 1 : 0)
    setOutput("application_control_con",(as_int & 32) == 32 ? 1 : 0)
    setOutput("application_control_uns",(as_int & 16) == 16 ? 1 : 0)
    setOutput("application_control_seq",as_int & 15)
    return "0x"+input
}

function getAppFunctionCode(input){
    console.log("Function Code: "+input)
    switch (input) {
        case "00":
            return "CONFIRM"
            break
        case "01":
            return "READ"
            break
        case "02":
            return "WRITE"
            break
        case "03":
            return "SELECT"
            break
        case "04":
            return "OPERATE"
            break
        case "05":
            return "DIRECT_OPERATE"
            break
        case "06":
            return "DIRECT_OPERATE_NR"
            break
        case "07":
            return "IMMED_FREEZE"
            break
        case "08":
            return "IMMED_FREEZE_NR"
            break
        case "09":
            return "FREEZE_CLEAR"
            break
        case "0A":
            return "FREEZE_CLEAR_NR"
            break
        case "0B":
            return "FREEZE_AT_TIME"
            break
        case "0C":
            return "FREEZE_AT_TIME_NR"
            break
        case "0D":
            return "COLD_RESTART"
            break
        case "0E":
            return "WARM_RESTART"
            break
        case "0F":
            return "INITIALIZE_DATA"
            break
        case "10":
            return "INITIALIZE_APPL"
            break
        case "11":
            return "START_APPL"
            break
        case "12":
            return "STOP_APPL"
            break
        case "13":
            return "SAVE_CONFIG"
            break
        case "14":
            return "ENABLE_UNSOLICITED"
            break
        case "15":
            return "DISABLE_UNSOLICITED"
            break
        case "16":
            return "ASSIGN_CLASS"
            break
        case "17":
            return "DELAY_MEASURE"
            break
        case "18":
            return "RECORD_CURRENT_TIME"
            break
        case "19":
            return "OPEN_FILE"
            break
        case "1a":
            return "CLOSE_FILE"
            break
        case "1b":
            return "DELETE_FILE"
            break
        case "1c":
            return "GET_FILE_INFO"
            break
        case "1d":
            return "AUTHENTICATE_FILE"
            break
        case "1e":
            return "ABORT_FILE"
            break
        case "1f":
            return "ACTIVATE_CONFIG"
            break
        case "20":
            return "AUTHENTICATE_REQ"
            break
        case "21":
            return "AUTH_REQ_NO_ACK"
            break
        case "81":
            return "RESPONSE"
            break
        case "82":
            return "UNSOLICITED_RESPONSE"
            break
        case "83":
            return "AUTHENTICATE_RESP"
            break
    }
}

function getLSBIIN(input){
    console.log("LSB IIN: "+input)
}

function getMSBIIN(input){
    console.log("MSB IIN: "+input)
}

function handleApplicationHeader(input){
    //056414F3010000040A3BC0 C3 01 3C 02 06 3C 03 06 3C 04 06 3C 01 06 9A 12
    setOutput("application-header-data",input)
    setOutput("application_control",getApplicationControl(input.substring(0,2)))
    setOutput("app_function_code",getAppFunctionCode(input.substring(2,4)))
    console.log("Length: "+input.length)
    if (input.length == 8){
        setOutput("internal_indications_lsb",getLSBIIN(4,6))
        setOutput("internal_indications_msb",getMSBIIN(6,8))
    }
}

function main(input){
    //console.log(input)
    if (input.length < 20){
        return console.log("Input too short...")
    }

    handleDataLinkLayer(input.substring(0,20))
    handleTransportLayer(input.substring(20,22))
    
    if ((Number("0x"+input.substring(6,8))>>7 & 0x1) == 1){
        console.log("marco")
        handleApplicationHeader(input.substring(22,26))
    } else{
        console.log("polo")
        handleApplicationHeader(input.substring(22,30)) //Internal Indications only included in responses from outstation.
    }
}