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

function hex2int(hex){
    return Number("0x"+hex)
}

function hex2bin(hex){
    return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}

function bin2hex(bin){
    return parseInt(bin, 2).toString(16).toUpperCase();
}

function calculateCRC(data){
    //https://github.com/IvanGaravito/dnp3-crc/blob/master/index.js
    var crcTable =
[
    0x0000, 0x365E, 0x6CBC, 0x5AE2, 0xD978, 0xEF26, 0xB5C4, 0x839A,
    0xFF89, 0xC9D7, 0x9335, 0xA56B, 0x26F1, 0x10AF, 0x4A4D, 0x7C13,
    0xB26B, 0x8435, 0xDED7, 0xE889, 0x6B13, 0x5D4D, 0x07AF, 0x31F1,
    0x4DE2, 0x7BBC, 0x215E, 0x1700, 0x949A, 0xA2C4, 0xF826, 0xCE78,
    0x29AF, 0x1FF1, 0x4513, 0x734D, 0xF0D7, 0xC689, 0x9C6B, 0xAA35,
    0xD626, 0xE078, 0xBA9A, 0x8CC4, 0x0F5E, 0x3900, 0x63E2, 0x55BC,
    0x9BC4, 0xAD9A, 0xF778, 0xC126, 0x42BC, 0x74E2, 0x2E00, 0x185E,
    0x644D, 0x5213, 0x08F1, 0x3EAF, 0xBD35, 0x8B6B, 0xD189, 0xE7D7,
    0x535E, 0x6500, 0x3FE2, 0x09BC, 0x8A26, 0xBC78, 0xE69A, 0xD0C4,
    0xACD7, 0x9A89, 0xC06B, 0xF635, 0x75AF, 0x43F1, 0x1913, 0x2F4D,
    0xE135, 0xD76B, 0x8D89, 0xBBD7, 0x384D, 0x0E13, 0x54F1, 0x62AF,
    0x1EBC, 0x28E2, 0x7200, 0x445E, 0xC7C4, 0xF19A, 0xAB78, 0x9D26,
    0x7AF1, 0x4CAF, 0x164D, 0x2013, 0xA389, 0x95D7, 0xCF35, 0xF96B,
    0x8578, 0xB326, 0xE9C4, 0xDF9A, 0x5C00, 0x6A5E, 0x30BC, 0x06E2,
    0xC89A, 0xFEC4, 0xA426, 0x9278, 0x11E2, 0x27BC, 0x7D5E, 0x4B00,
    0x3713, 0x014D, 0x5BAF, 0x6DF1, 0xEE6B, 0xD835, 0x82D7, 0xB489,
    0xA6BC, 0x90E2, 0xCA00, 0xFC5E, 0x7FC4, 0x499A, 0x1378, 0x2526,
    0x5935, 0x6F6B, 0x3589, 0x03D7, 0x804D, 0xB613, 0xECF1, 0xDAAF,
    0x14D7, 0x2289, 0x786B, 0x4E35, 0xCDAF, 0xFBF1, 0xA113, 0x974D,
    0xEB5E, 0xDD00, 0x87E2, 0xB1BC, 0x3226, 0x0478, 0x5E9A, 0x68C4,
    0x8F13, 0xB94D, 0xE3AF, 0xD5F1, 0x566B, 0x6035, 0x3AD7, 0x0C89,
    0x709A, 0x46C4, 0x1C26, 0x2A78, 0xA9E2, 0x9FBC, 0xC55E, 0xF300,
    0x3D78, 0x0B26, 0x51C4, 0x679A, 0xE400, 0xD25E, 0x88BC, 0xBEE2,
    0xC2F1, 0xF4AF, 0xAE4D, 0x9813, 0x1B89, 0x2DD7, 0x7735, 0x416B,
    0xF5E2, 0xC3BC, 0x995E, 0xAF00, 0x2C9A, 0x1AC4, 0x4026, 0x7678,
    0x0A6B, 0x3C35, 0x66D7, 0x5089, 0xD313, 0xE54D, 0xBFAF, 0x89F1,
    0x4789, 0x71D7, 0x2B35, 0x1D6B, 0x9EF1, 0xA8AF, 0xF24D, 0xC413,
    0xB800, 0x8E5E, 0xD4BC, 0xE2E2, 0x6178, 0x5726, 0x0DC4, 0x3B9A,
    0xDC4D, 0xEA13, 0xB0F1, 0x86AF, 0x0535, 0x336B, 0x6989, 0x5FD7,
    0x23C4, 0x159A, 0x4F78, 0x7926, 0xFABC, 0xCCE2, 0x9600, 0xA05E,
    0x6E26, 0x5878, 0x029A, 0x34C4, 0xB75E, 0x8100, 0xDBE2, 0xEDBC,
    0x91AF, 0xA7F1, 0xFD13, 0xCB4D, 0x48D7, 0x7E89, 0x246B, 0x1235
]
    let crc=0
    data = data.match(/.{1,2}/g)
    data.forEach(function (j) {
        j = "0x"+j
    	crc = (crc >> 8) ^ crcTable[(crc ^ j) & 0x00FF]
    })
    return (~crc & 0xFFFF).toString(16) /* this is 16 bit CRC */
}

function validateData(data){
    console.log(data.substr(0,4))
    //Check starting bytes
    if (data.substr(0,4) != "0564"){
        return false
    }

    //Check length
    let length = hex2int(data.substr(4,2))
    if (length < 5){
        return false
    }

    //Check CRC
    let crc = calculateCRC(data.substr(0,16))
    if (crc != MSBLSBSwap(data.substr(16,4))){
        return false
    }

    return true
}

////////////
//PARSING//
///////////
function parseDataLinkLayer(data){
    let length = hex2int(data.substr(4,2))
    let control_octet = data.substr(6,2)
    let destination = hex2int(MSBLSBSwap(data.substr(8,4)))
    let source = hex2int(MSBLSBSwap(data.substr(12,4)))
    let crc = MSBLSBSwap(data.substr(16,4))

    // console.log("Length: "+length)
    // console.log("Control Octet: "+control_octet)
    // console.log("Destination: "+destination)
    // console.log("Source: "+source)
    // console.log("CRC: "+crc)
    let control_octet_parsed = parseControlOctet(control_octet);
    return {length:length,destination:destination,source:source,crc:crc,control_octet:control_octet_parsed}
}

function parseControlOctet(control_octet){
    let data_bin = hex2bin(control_octet)
    let dir=data_bin.substr(0,1)
    let prm=data_bin.substr(1,1)
    let fcb=data_bin.substr(2,1)
    let fcv=data_bin.substr(3,1)
    let function_code=bin2hex(data_bin.substr(4))
    let function_code_name=""
    if (prm==1){
        switch(function_code){
            case "0":
                function_code_name="RESET_LINK_STATES"
                break;
            case "2":
                function_code_name="TEST_LINK_STATES"
                break;
            case "3":
                function_code_name="CONFIRMED_USER_DATA"
                break;
            case "4":
                function_code_name="UNCONFIRMED_USER_DATA"
                break;
            case "9":
                function_code_name="REQUEST_LINK_STATUS"
                break;
            default:
                function_code_name="INVALID_FUNCTION_CODE"
                break;
        }
    }else if (prm==0){
        switch(function_code){
            case "0":
                function_code_name="ACK"
                break;
            case "1":
                function_code_name="NACK"
                break;
            case 'B':
                function_code_name="LINK_STATUS"
                break;
            case 'F':
                function_code_name="NOT_SUPPORTED"
                break;
            default:
                function_code_name="INVALID_FUNCTION_CODE"
                break;
        }
    }else {
        console.log("WHY IS THE PRM NOT 0 OR 1?????????????????????????????????????????? panic panic scream panic")
    }

    return {dir:dir,prm:prm,fcb:fcb,fcv:fcv,function_code:function_code,function_code_name:function_code_name}

}

function parseTransportControl(data){

}

function parseDataChunks(data){

}

function cleanCRC(data){

}

function parseApplicationHeader(data){

}

function parseObjectHeader(data){

}

function parseObjects(data){

}

//test data
//05640bc4430800008b86c9cb013c02062cff
function main(input){
    if (validateData(input)){
        let data_link_layer = input.substr(0,20)
        let transport_control = input.substr(20,2)
        let data_chunks = input.substr(22)


        let parsed_data_link_layer = parseDataLinkLayer(data_link_layer)
        console.log(parsed_data_link_layer)
        let parsed_transport_control = parseTransportControl(transport_control)
        let parsed_data_chunks = parseDataChunks(data_chunks)
    } else{
        console.log("Data Invalid!")
    }
}