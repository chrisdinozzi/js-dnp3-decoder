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

function hex2bin(hex){//https://stackoverflow.com/a/64235212
    hex = hex.replace("0x", "").toLowerCase();
    var out = "";
    for(var c of hex) {
        switch(c) {
            case '0': out += "0000"; break;
            case '1': out += "0001"; break;
            case '2': out += "0010"; break;
            case '3': out += "0011"; break;
            case '4': out += "0100"; break;
            case '5': out += "0101"; break;
            case '6': out += "0110"; break;
            case '7': out += "0111"; break;
            case '8': out += "1000"; break;
            case '9': out += "1001"; break;
            case 'a': out += "1010"; break;
            case 'b': out += "1011"; break;
            case 'c': out += "1100"; break;
            case 'd': out += "1101"; break;
            case 'e': out += "1110"; break;
            case 'f': out += "1111"; break;
            default: return "";
        }
    }

    return out;
} 
///////////////////
//DATA LINK LAYER//
///////////////////
function getStart(input){
    console.log("Start: "+input)
    if (input=="0564"){
        state="valid"
    } else{
        state="invalid"
    }
    return "0x"+input + `(${state})`
}

function getLength(input){
    console.log("Length: "+input)
    as_int = Number(input)
    return "0x"+input +`(${as_int})`
}

function getDirection(input){
    console.log("Control (direction): "+input)
    as_int = Number("0x"+input)
    console.log(as_int>>7 & 0x1)
    if ((as_int>>7 & 0x1) == 1){
        return("From Master to Outstation")
    } else{
        return("From Outstation to Master")
    }
}

function getPrimaryMessage(input){
    console.log("Control (PRM): "+input)
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
    console.log("Link Function Code: "+input.substring(1))
    console.log("PRM: "+prm)
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
    console.log("Destination: "+input)
    //swap bytes around
    input = input.substring(2) +input.substring(0,2)
    return Number("0x"+input)
}

function getSource(input){
    console.log("Source: "+input)
    //swap bytes around
    input = input.substring(2) +input.substring(0,2)
    return Number("0x"+input)
}

function getCRC(input){
    console.log("CRC: "+input)
    //swap bytes around
    input = input.substring(2) +input.substring(0,2)
    return "0x"+input
}

function handleDataLinkLayer(input){
    //056405C001000004E921  <-- example input
    var start = input.substring(0,4)
    var length = input.substring(4,6)
    var control = input.substring(6,8)
    var destination = input.substring(8,12)
    var source = input.substring(12,16)
    var crc = input.substring(16,20)
    console.log("Data Link Layer: "+input)
    
    setOutput("start",getStart(start))
    setOutput("length",getLength(length))
    setOutput("direction",getDirection(control))
    setOutput("prm",getPrimaryMessage(control))
    setOutput("link_function_code",getLinkFunctionCode(control))
    setOutput("destination",getDestination(destination))
    setOutput("source",getSource(source))
    setOutput("crc",getCRC(crc))
}

function main(input){
    //console.log(input)
    if (input.length < 20){
        return console.log("Input too short...")
    }

    handleDataLinkLayer(input.substring(0,20))

}