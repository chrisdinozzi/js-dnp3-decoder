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

function bin2int(bin){
    return parseInt(bin,2);
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
    let data_bin = hex2bin(data)
    let fin = data_bin.substr(0,1)
    let fir = data_bin.substr(1,1)
    let seq = bin2int(data_bin.substr(2))

    return {fin:fin,fir:fir,seq:seq}
}

function cleanCRC(data){
    let clean_data=""
    //TODO: validate the crc then take off the end
    if (data.length < 18){
        //one small chunk
        clean_data = data.substring(0,data.length-4)
    } else{
        data = data.match(/.{1,36}/g);
        //console.log(data)
        data.forEach(function (block) {
            clean_data+=block.substring(0,block.length-4)
        })
    }
    return clean_data
}

function parseDataChunks(data,dir){
    let clean_data = cleanCRC(data)
    let application_header=""
    let object_header=""

    if (dir==1){ //From Master
        application_header = clean_data.substr(2,4)
        object_header = clean_data.substr(6)
    } else if (dir==0){ //From Outstation
        //will include an extra 2 bytes for Internal Indications
        application_header = clean_data.substr(2,8)
        object_header = clean_data.substr(10)
    }

    let parsed_application_header = parseApplicationHeader(application_header)
    console.log(parsed_application_header)

    //TODO: there may be multiple objects in a packet, how can i figure that out?
    let parsed_object_header = parseObjectHeader(object_header)
    console.log(parsed_object_header)
    let dnp3_objects = parseDNP3Objects(parsed_object_header, clean_data,dir)
    console.log(dnp3_objects)


    return {application_header:parsed_application_header,object_header:parsed_object_header,dnp3_objects:dnp3_objects}

}

function parseDNP3Objects(parsed_object_header,clean_data,dir){
    let range = parsed_object_header.range
    let object_size = parsed_object_header.object_size
    let data_size = (object_size * range)/8
    let prefix_size = parsed_object_header.object_prefix.size //in octets
    let start_offset=parsed_object_header.data_start_offset

    if (dir==1){//From Master
        start_offset += 6
        console.log("Start Offset: "+start_offset)
    } else if (dir==0){//From Outstation
        start_offset += 10
        console.log("Start Offset: "+start_offset)
    }

    let object_data=[]

    let offset=start_offset
    let index=-1
    let object_value=""
    let chunk=""
    console.log("Offset: "+offset)
    for (let i=0;i<range;i++){
        index = hex2int(MSBLSBSwap(clean_data.substr(offset,prefix_size*2)))
        offset+=prefix_size*2
        chunk = clean_data.substr(offset,object_size/4)
        object_value = determineObjectValue(parsed_object_header.group,parsed_object_header.variation,chunk)
        object_data.push({index:index, data:chunk,value:object_value})
        offset+=object_size/4
    }
    return object_data
}

function parseFunctionCode(function_code){
    switch (function_code) {
        case "00":
            return "CONFIRM"
        case "01":
            return "READ"
        case "02":
            return "WRITE"
        case "03":
            return "SELECT"
            
        case "04":
            return "OPERATE"
            
        case "05":
            return "DIRECT_OPERATE"
            
        case "06":
            return "DIRECT_OPERATE_NR"
            
        case "07":
            return "IMMED_FREEZE"
            
        case "08":
            return "IMMED_FREEZE_NR"
            
        case "09":
            return "FREEZE_CLEAR"
            
        case "0A":
            return "FREEZE_CLEAR_NR"
            
        case "0B":
            return "FREEZE_AT_TIME"
            
        case "0C":
            return "FREEZE_AT_TIME_NR"
            
        case "0D":
            return "COLD_RESTART"
            
        case "0E":
            return "WARM_RESTART"
        case "0F":
            return "INITIALIZE_DATA"
        case "10":
            return "INITIALIZE_APPL"
        case "11":
            return "START_APPL"
        case "12":
            return "STOP_APPL"
        case "13":
            return "SAVE_CONFIG"
        case "14":
            return "ENABLE_UNSOLICITED"
        case "15":
            return "DISABLE_UNSOLICITED"
        case "16":
            return "ASSIGN_CLASS"
        case "17":
            return "DELAY_MEASURE"
        case "18":
            return "RECORD_CURRENT_TIME"
        case "19":
            return "OPEN_FILE"
        case "1a":
            return "CLOSE_FILE"
        case "1b":
            return "DELETE_FILE"
        case "1c":
            return "GET_FILE_INFO"
        case "1d":
            return "AUTHENTICATE_FILE"
        case "1e":
            return "ABORT_FILE"
        case "1f":
            return "ACTIVATE_CONFIG"
        case "20":
            return "AUTHENTICATE_REQ"
        case "21":
            return "AUTH_REQ_NO_ACK"
        case "81":
            return "RESPONSE"
        case "82":
            return "UNSOLICITED_RESPONSE"
        case "83":
            return "AUTHENTICATE_RESP"
    }
}

function parseApplicationHeader(data){
    //Application Control
    let application_control = data.substr(0,2)
    application_control = hex2bin(application_control)
    let fir = application_control.substr(0,1)
    let fin = application_control.substr(1,1)
    let con = application_control.substr(2,1)
    let uns = application_control.substr(3,1)
    let seq = bin2int(application_control.substr(4))
    application_control = {fir:fir,fin:fin,con:con,uns:uns,seq:seq}

    //Function Code
    let function_code = data.substr(2,2)
    let function_code_name = parseFunctionCode(function_code)
    
    //Internal Indicators
    if (data.length==8){//From Outstation
        //do interal indicators too
        let iin = MSBLSBSwap(data.substr(4,4))
        let msb_iin=hex2bin(iin.substr(0,2))
        let lsb_iin=hex2bin(iin.substr(2,2))

        //-1 = no iin
        msb_iin = msb_iin.split("").reverse().join("").search('1')
        lsb_iin = lsb_iin.split("").reverse().join("").search('1')
        
        let msb_iin_message=""
        switch(msb_iin){
            case 0:
                msb_iin_message="Function Code Not Supported"
                break;
            case 1:
                msb_iin_message="Requested Object Unknown"
                break;
            case 2:
                msb_iin_message="Parameter Error"
                break;
            case 3:
                msb_iin_message="Event Buffer Overflow"
                break;
            case 4:
                msb_iin_message="Already Executing"
                break;
            case 5:
                msb_iin_message="Configuration Corrupt"
                break;
            case 6:
                msb_iin_message="Reserved"
                break;
            case 7:
                msb_iin_message="Reserved"
                break;
            case -1:
                msb_iin_message="No MSB IIN Message"
                break;
            default:
                msb_iin_message="MSB IIN Meesage Broken!!!!!!!!!!!!!!!!!"
                break;
        }

        let lsb_iin_message=""
        switch(lsb_iin){
            case 0:
                lsb_iin_message="All Stations"
                break;
            case 1:
                lsb_iin_message="Class 1 Data Available"
                break;
            case 2:
                lsb_iin_message="Class 2 Data Available"
                break;
            case 3:
                lsb_iin_message="Class 3 Data Available"
                break;
            case 4:
                lsb_iin_message="Need Time"
                break;
            case 5:
                lsb_iin_message="Local Control"
                break;
            case 6:
                lsb_iin_message="Device Trouble"
                break;
            case 7:
                lsb_iin_message="Device Restart"
                break;
            case -1:
                lsb_iin_message="No LSB IIN Message"
                break;
            default:
                lsb_iin_message="UUUUUH LSB MACHINE BROKE"
                break;
        }
        return {application_control:application_control,function_code:function_code_name,msb_iin:msb_iin_message,lsb_iin:lsb_iin_message}
    }
    return {application_control:application_control,function_code:function_code_name}
}

function parseQualifierField(qf){
    let object_prefix_code = bin2int(qf.substr(1,3))
    let range_specifier_code = bin2hex(qf.substr(4))
    console.log("Object Prefix Code: "+object_prefix_code)
    console.log("Range Specifier Code: "+range_specifier_code)

    let object_prefix={size:-1,type:""} 
    switch (object_prefix_code){
        case 0:
            object_prefix={size:0,type:""}
            break;
        case 1:
            object_prefix={size:1,type:"Index"}
            break;
        case 2:
            object_prefix={size:2,type:"Index"}
            break;
        case 3:
            object_prefix={size:4,type:"Index"}
            break;
        case 4:
            object_prefix={size:1,type:"Object Size"}
            break;
        case 5:
            object_prefix={size:2,type:"Object Size"}
            break;
        case 6:
            object_prefix={size:4,type:"Object Size"}
            break;
        case 7:
            object_prefix={size:-1,type:"Reserved"}
            break;
    }

    let range_field_contains={size:-1,type:""} //Either Start/Stop or Count
    switch(range_specifier_code){
        case "0":
            range_field_contains={size:1,type:"start/stop"}
            break;
        case "1":
            range_field_contains={size:2,type:"start/stop"}
            break;
        case "2":
            range_field_contains={size:4,type:"start/stop"}
            break;
        case "3":
            range_field_contains={size:1,type:"start/stop virtual"}
            break;
        case "4":
            range_field_contains={size:2,type:"start/stop virtual"}
            break;
        case "5":
            range_field_contains={size:4,type:"start/stop virtual"}
            break;
        case "6":
            range_field_contains={size:0,type:"No Range Field"}
            break;
        case "7":
            range_field_contains={size:1,type:"count"}
            break;
        case "8":
            range_field_contains={size:2,type:"count"}
            break;
        case "9":
            range_field_contains={size:4,type:"count"}
            break;
        case "A":
            range_field_contains={size:-1,type:"Reserved"}
            break;
        case "B":
            range_field_contains={size:1,type:"count (variable)"}
            break;
        case "C":
            range_field_contains={size:-1,type:"Reserved"}
            break;
        case "D":
            range_field_contains={size:-1,type:"Reserved"}
            break;
        case "E":
            range_field_contains={size:-1,type:"Reserved"}
            break;
        case "F":
            range_field_contains={size:-1,type:"Reserved"}
            break;
    }

    return {object_prefix:object_prefix,range_field_contains:range_field_contains}
}

function calculateObjectSize(group,variation){
    //returns size in bits, not octets
    if (group==1 || group==10){
        if (variation==1){
            return 1
        } else if(variation==2){
            return 8
        }
    }else if (group==2 || group==4 || group==11|| group==13){
        if (variation==1){
            return 1*8
        }else if (variation==2){
            return 7*8
        }else if (variation==3){
            return 3*8
        }
    }else if (group==3){
        if (variation==1){
            return 2
        }else if (variation==2){
            return 8
        }
    }else if (group==12){
        if (variation==1 || variation==2){
            return 11*8 
        }
    }else if (group==20){
        if (variation==1){
            return 5*8
        }else if (variation==2){
            return 3*8
        }
        else if (variation==5){
            return 4*8
        }
        else if (variation==6){
            return 2*8
        }
        
    }else if (group==21 || group==22 || group==23){
        if (variation==1){
            return 5*8
        }else if (variation==2){
            return 3*8
        }
        else if (variation==5){
            return 11*8
        }
        else if (variation==6){
            return 9*8
        }else if (variation==9){
            return 4*8
        }
        else if (variation==10){
            return 2*8
        }
        
    }else if (group==30){
        if (variation==1 || variation==5){
            return 5*8
        }else if (variation==2){
            return 3*8
        }
        else if (variation==3){
            return 4*8
        }
        else if (variation==4){
            return 2*8
        }
        else if (variation==6){
            return 9*8
        }
        
    }else if (group==31){
        if (variation==1){
            return 5*8
        }else if (variation==2){
            return 3*8
        }
        else if (variation==3){
            return 11*8
        }
        else if (variation==4){
            return 9*8
        }
        else if (variation==5){
            return 4*8
        }
        else if (variation==6){
            return 2*8
        }
        else if (variation==7){
            return 5*8
        }
        else if (variation==8){
            return 9*8
        }
    }else if (group==32 || group==33 || group==42|| group==43){
        if (variation==1 ){
            return 5*8
        }else if (variation==2){
            return 3*8
        }
        else if (variation==3){
            return 11*8
        }
        else if (variation==4){
            return 9*8
        }
        else if (variation==5){
            return 5*8
        }
        else if (variation==6){
            return 9*8
        }
        else if (variation==7){
            return 11*8
        }
        else if (variation==8){
            return 15*8
        }
        
    }else if (group==34){
        if (variation==1 ){
            return 2*8
        }else if (variation==2 || variation==3){
            return 4*8
        }
        
    }else if (group==40 || group==41){
        if (variation==1 ){
            return 5*8
        }else if (variation==2){
            return 3*8
        }
        else if (variation==3){
            return 5*8
        }
        else if (variation==4){
            return 9*8
        }
        
    }else if (group==50){
        if (variation==1 ){
            return 6*8
        }else if (variation==2){
            return 10*8
        }
        else if (variation==3){
            return 6*8
        }
        else if (variation==4){
            return 11*8
        }
        
    }else if (group==51){
        return 6*8
    }else if (group==52){
        return 2*8
        
    }else if (group==80){
        return 2*8
        
    }else if (group==81){
        return 3*8
        
    }else if (group==86){
        if (variation==2){
            return 8
        }
        
    }else if (group==101){
        if (variation==1 ){
            return 2*8
        }else if (variation==2){
            return 4*8
        }
        else if (variation==3){
            return 8*8
        }
        
    }else if (group==102){
        return 8
    }else if (group==120){
        if (variation==4){
            return 8
        }
        
    }else if (group==121){
        if (variation==1){
            return 7*8
        }
        
    }else if (group==122){
        if (variation==1){
            return 7*8
        } else if (variation==2){
            return 13*8
        }
    }
    return 0
}

function parseObjectHeader(data){
    console.log("First Object Header: "+data)
    let group = hex2int(data.substr(0,2))
    let variation = hex2int(data.substr(2,2))

    let object_size=calculateObjectSize(group,variation) //in bits

    let qualifier_field = hex2bin(data.substr(4,2))

    console.log("Group: "+group)
    console.log("Variation: "+variation)
    console.log("Qualifier Field: "+qualifier_field)
    let qualifier_field_parsed = parseQualifierField(qualifier_field)

    let object_prefix = qualifier_field_parsed.object_prefix
    let range_field_contains = qualifier_field_parsed.range_field_contains
    let range=0
    let data_start_offset=-1
    if (range_field_contains.size!=0){
        let range_size = range_field_contains.size //in octets
        if (range_field_contains.type=="count"){
            console.log(data.substr(6,range_size*2))
            range = hex2int(MSBLSBSwap(data.substr(6,range_size*2)))
            data_start_offset=6+range_size*2
        } else if (range_field_contains.type="start/stop"){
            let start = hex2int(MSBLSBSwap(data.substr(6,range_size*2)))
            let stop = hex2int(MSBLSBSwap(data.substr(6+range_size*2,range_size*2)))
            range = stop - start + 1
            data_start_offset=6+range_size*4
        }
    }
    console.log("data_start_offset: "+data_start_offset)
    return {group:group,variation:variation,object_size:object_size,object_prefix:object_prefix,range_field_contains:range_field_contains,range:range,data_start_offset:data_start_offset}
}

function determineObjectValue(group,variation,data){
    switch (group){
        case 1: //Group 1
            switch (variation){
                case 2:
                    return parseGroup1Var2(data)
            }
        case 30: //Group 30
            switch (variation){
                case 2:
                    return parseGroup30Var2(data)
            }
    }
    console.log("PANIC")
}

//these functions should return objects that contain:
//group
//variation
//value (may be an object)


function parseGroup1Var2(data){
    let group=1
    let variation=2
    data = hex2int(data)
    value={point_value:0,chatter_filter:0,local_force:0,remote_force:0,comm_failure:0,restart:0,online:0}
    if (data&1){ value.online=1}
    if (data&2){ value.restart=1}
    if (data&4){value.comm_failure=1}
    if (data&8){value.remote_force=1}
    if (data&16){ value.local_force=1}
    if (data&32){ value.chatter_filter=1}
    if (data&128){ value.point_value=1}
    return {group:group,variation:variation,value:value}
}

function parseGroup30Var2(data){
    return ""
}

function main(input){
    if (validateData(input)){
        let data_link_layer = input.substr(0,20)
        let transport_control = input.substr(20,2)
        let data_chunks = input.substr(20)

        let parsed_data_link_layer = parseDataLinkLayer(data_link_layer)
        console.log(parsed_data_link_layer)

        let parsed_transport_control = parseTransportControl(transport_control)
        console.log(parsed_transport_control)

        let parsed_data_chunks = parseDataChunks(data_chunks,parsed_data_link_layer.control_octet.dir)
        console.log(parsed_data_chunks)
    } else{
        console.log("Data Invalid!")
    }
}