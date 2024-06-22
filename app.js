//https://cdn.chipkin.com/assets/uploads/imports/resources/DNP3QuickReference.pdf
//https://www.racom.eu/eng/support/prot/dnp3/index.html
//https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Treiber_DNP3/dnp3_application_layer.html
//https://www.researchgate.net/figure/DNP3-message-architecture_fig1_308143053

/////////////////////
//HELPER FUNCTIONS//
////////////////////
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

function setCheckbox(id,value){
    if (document.getElementById(id)==null){
        return "ID not found."
    } 
    if (value==1){
        document.getElementById(id).checked = true;
        return
    } else if (value==0){
        document.getElementById(id).checked = false;
        return
    }
}

function MSBLSBSwap(data){
    msb = data.substr(0,2)
    lsb = data.substr(2)
    return String(lsb)+String(msb)
}

function hexToInt(hex){
    return Number("0x"+hex)
}


function validateData(data){
    //check the first characters are 0x05 and 0x64
    //return true or false
}

function getLength(data){
    //extract length and return as integer
}

////////////
//PARSING//
///////////
function parseDataLinkLayer(data){

}

function parseTransportControl(data){

}

function cleanCRC(data){

}

function parseApplicationHeader(data){

}

function parseObjectHeader(data){

}

function parseObjects(data){

}

function main(input){
    //1. Handle data link layer (first 10 bytes/20 characters)
    //2. Handle transport control (byte 11)
    //3. Clean out CRC from rest of data
    //4. Parse application header
    //5. Parse first object header
}