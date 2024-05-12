//https://cdn.chipkin.com/assets/uploads/imports/resources/DNP3QuickReference.pdf
//https://www.racom.eu/eng/support/prot/dnp3/index.html
//https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Treiber_DNP3/dnp3_application_layer.html

function cleanInput(i){
    return i.replaceAll(" ","").replaceAll("\n","").replaceAll("0x","")
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

function handleDataLinkLayer(input){
    //056405C001000004E921  <-- example input
    console.log("Data Link Layer: "+input)
}

function main(input){
    //console.log(input)
    if (input.length < 20){
        return console.log("Input too short...")
    }

    handleDataLinkLayer(input.substring(0,20))

}