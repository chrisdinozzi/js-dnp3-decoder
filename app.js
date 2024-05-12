//https://cdn.chipkin.com/assets/uploads/imports/resources/DNP3QuickReference.pdf
//https://www.racom.eu/eng/support/prot/dnp3/index.html
//https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Treiber_DNP3/dnp3_application_layer.html

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
    return as_int<<2
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
function handleApplicationHeader(input){
    //056414F3010000040A3BC0 C3 01 3C 02 06 3C 03 06 3C 04 06 3C 01 06 9A 12
    setOutput("application-header-data",input)
    console.log("Application Header: "+ input)
}

function main(input){
    //console.log(input)
    if (input.length < 20){
        return console.log("Input too short...")
    }

    handleDataLinkLayer(input.substring(0,20))
    handleTransportLayer(input.substring(20,22))
    handleApplicationHeader(input.substring(22,28))
}