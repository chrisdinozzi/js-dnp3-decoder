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

function main(input){

}