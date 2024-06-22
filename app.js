//https://cdn.chipkin.com/assets/uploads/imports/resources/DNP3QuickReference.pdf
//https://www.racom.eu/eng/support/prot/dnp3/index.html
//https://www.winccoa.com/documentation/WinCCOA/latest/en_US/Treiber_DNP3/dnp3_application_layer.html
//https://www.researchgate.net/figure/DNP3-message-architecture_fig1_308143053

// function cleanInput(i){
//     return i.replaceAll(" ","").replaceAll("\n","").replaceAll("0x","").toLowerCase()
// }

// function getInput(){
//     return document.getElementById("input").value;
// }

// function setOutput(id,value){
//     if (document.getElementById(id)==null){
//         return "ID not found."
//     } else{
//         document.getElementById(id).value = value;
//         return 1
//     }
// }

// function setCheckbox(id,value){
//     if (document.getElementById(id)==null){
//         return "ID not found."
//     } 
//     //console.log("Setting: "+id+" to: "+value)
//     if (value==1){
//         document.getElementById(id).checked = true;
//         return
//     } else if (value==0){
//         document.getElementById(id).checked = false;
//         return
//     }
// }

// function MSBLSBSwap(data){
//     msb = data.substr(0,2)
//     //console.log(msb)
//     lsb = data.substr(2)
//     //console.log(lsb)
//     return String(lsb)+String(msb)
// }

// //TODO: Rewrite this to take each 18 char chunk seperatly and remove the last two chars of the string, that will handle short chunks properly
// function stripCRC(data){
//     var clean_data=""
//     console.log("LOOK HERE!!!!!!! "+Math.ceil(data.length/36))
//     for (let i=0;i<Math.ceil(data.length/36);i++){
//         clean_data+=data.substr(i*36,32);
//         console.log("Data (chunk no. "+i+"):" + data.substr(i*36,32))   
//         console.log("CRC: (chunk no. "+i+"):" +data.substr(i*36+32,4))
//     }
//     console.log("Removed CRC: "+clean_data)
//     return clean_data
// }

// ///////////////////
// //DATA LINK LAYER//
// ///////////////////
// function getStart(input){
//     //console.log("Start: "+input)
//     if (input=="0564"){
//         state="valid"
//     } else{
//         state="invalid"
//     }
//     return "0x"+input + `(${state})`
// }

// function getLength(input){
//     //console.log("Length: "+input)
//     as_int = Number(input)
//     return "0x"+input +`(${as_int})`
// }

// function getDirection(input){
//     //console.log("Control (direction): "+input)
//     as_int = Number("0x"+input)
//     //console.log(as_int>>7 & 0x1)
//     if ((as_int>>7 & 0x1) == 1){
//         return("From Master to Outstation")
//     } else{
//         return("From Outstation to Master")
//     }
// }

// function getPrimaryMessage(input){
//     //console.log("Control (PRM): "+input)
//     as_int = Number("0x"+input)
//     if ((as_int>>6 & 0x01) == 1){
//         return("Primary to Secondary")
//     } else{
//         return("Secondary to Primary")
//     }
// }

// function getLinkFunctionCode(input){
//     as_int = Number("0x"+input)
//     prm=-1
//     if ((as_int>>6 & 0x01) == 1){
//         prm=1
//     } else{
//         prm=0
//     }
//     //console.log("Link Function Code: "+input.substring(1))
//     //console.log("PRM: "+prm)
//     if (prm==1){
//         switch (input.substring(1)){
//             case "0":
//                 return "RESET_LINK_STATUS";
//                 break;
//             case "2":
//                 return "TEST_LINK_STATES"
//                 break;
//             case "3":
//                 return "CONFIRMED_USER_DATA"
//                 break;
//             case "4":
//                 return "UNCONFIRMED_USER_DATA"
//                 break;
//             case "9":
//                 return "REQUEST_LINK_STATUS"
//                 break;
//         }
//     }

//     if (prm==0){
//         switch (input.substring(1)){
//             case "0":
//                 return "ACK"
//                 break;
//             case "1":
//                 return "NACK"
//                 break;
//             case "B":
//                 return "LINK_STATUS"
//                 break;
//             case "F":
//                 return "NOT_SUPPORTED"
//                 break;
//         }
//     }

// }

// function getDestination(input){
//     //console.log("Destination: "+input)
//     //swap bytes around
//     input = input.substring(2) +input.substring(0,2)
//     return Number("0x"+input)
// }

// function getSource(input){
//     //console.log("Source: "+input)
//     //swap bytes around
//     input = input.substring(2) +input.substring(0,2)
//     return Number("0x"+input)
// }

// function getCRC(input){
//     //console.log("CRC: "+input)
//     //swap bytes around
//     input = input.substring(2) +input.substring(0,2)
//     return "0x"+input
// }

// function handleDataLinkLayer(input){
//     //056405C001000004E921  <-- example input
//     setOutput("data-link-data",input)
//     var start = input.substring(0,4)
//     var length = input.substring(4,6)
//     var control = input.substring(6,8)
//     var destination = input.substring(8,12)
//     var source = input.substring(12,16)
//     var crc = input.substring(16,20)
//     //console.log("Data Link Layer: "+input)
    
//     setOutput("start",getStart(start))
//     setOutput("length",getLength(length))
//     setOutput("direction",getDirection(control))
//     setOutput("prm",getPrimaryMessage(control))
//     //TODO: add something for DFC
//     setOutput("link_function_code",getLinkFunctionCode(control))
//     setOutput("destination",getDestination(destination))
//     setOutput("source",getSource(source))
//     setOutput("crc",getCRC(crc))
// }
// ///////////////////
// //TRANSPORT LAYER//
// ///////////////////
// function getFIN(input){
//     as_int = Number("0x"+input)
//     if ((as_int>>7 & 0x1) == 1){
//         return "1"
//     } else{
//         return "0"
//     }
// }

// function getFIR(input){
//     as_int = Number("0x"+input)
//     if ((as_int>>6 & 0x01) == 1){
//         return "1"
//     } else{
//         return "0"
//     }
// }

// function getSeq(input){
//     as_int = Number("0x"+input)
//     //console.log(as_int)
//     bits = (as_int & 0x1f)
//     //console.log(bits)
//     return bits
// }

// function handleTransportLayer(input){
//     setOutput("transport-layer-data",input)
//     setOutput("fin",getFIN(input))
//     setOutput("fir",getFIR(input))
//     setOutput("seq",getSeq(input))

// }


// ///////////////////////
// //APPLICATION HEADER//
// //////////////////////
// function getApplicationControl(input){
//     //console.log("Application Control: "+input)
//     as_int = Number("0x"+input)
//     //console.log("Application Control (int): "+as_int)

//     setOutput("application_control_fir",(as_int & 128) == 128 ? 1 : 0)
//     setOutput("application_control_fin",(as_int & 64) == 64 ? 1 : 0)
//     setOutput("application_control_con",(as_int & 32) == 32 ? 1 : 0)
//     setOutput("application_control_uns",(as_int & 16) == 16 ? 1 : 0)
//     setOutput("application_control_seq",as_int & 15)
//     return "0x"+input
// }

// function getAppFunctionCode(input){
//     //console.log("Function Code: "+input)
//     switch (input) {
//         case "00":
//             return "CONFIRM"
//             break
//         case "01":
//             return "READ"
//             break
//         case "02":
//             return "WRITE"
//             break
//         case "03":
//             return "SELECT"
//             break
//         case "04":
//             return "OPERATE"
//             break
//         case "05":
//             return "DIRECT_OPERATE"
//             break
//         case "06":
//             return "DIRECT_OPERATE_NR"
//             break
//         case "07":
//             return "IMMED_FREEZE"
//             break
//         case "08":
//             return "IMMED_FREEZE_NR"
//             break
//         case "09":
//             return "FREEZE_CLEAR"
//             break
//         case "0A":
//             return "FREEZE_CLEAR_NR"
//             break
//         case "0B":
//             return "FREEZE_AT_TIME"
//             break
//         case "0C":
//             return "FREEZE_AT_TIME_NR"
//             break
//         case "0D":
//             return "COLD_RESTART"
//             break
//         case "0E":
//             return "WARM_RESTART"
//             break
//         case "0F":
//             return "INITIALIZE_DATA"
//             break
//         case "10":
//             return "INITIALIZE_APPL"
//             break
//         case "11":
//             return "START_APPL"
//             break
//         case "12":
//             return "STOP_APPL"
//             break
//         case "13":
//             return "SAVE_CONFIG"
//             break
//         case "14":
//             return "ENABLE_UNSOLICITED"
//             break
//         case "15":
//             return "DISABLE_UNSOLICITED"
//             break
//         case "16":
//             return "ASSIGN_CLASS"
//             break
//         case "17":
//             return "DELAY_MEASURE"
//             break
//         case "18":
//             return "RECORD_CURRENT_TIME"
//             break
//         case "19":
//             return "OPEN_FILE"
//             break
//         case "1a":
//             return "CLOSE_FILE"
//             break
//         case "1b":
//             return "DELETE_FILE"
//             break
//         case "1c":
//             return "GET_FILE_INFO"
//             break
//         case "1d":
//             return "AUTHENTICATE_FILE"
//             break
//         case "1e":
//             return "ABORT_FILE"
//             break
//         case "1f":
//             return "ACTIVATE_CONFIG"
//             break
//         case "20":
//             return "AUTHENTICATE_REQ"
//             break
//         case "21":
//             return "AUTH_REQ_NO_ACK"
//             break
//         case "81":
//             return "RESPONSE"
//             break
//         case "82":
//             return "UNSOLICITED_RESPONSE"
//             break
//         case "83":
//             return "AUTHENTICATE_RESP"
//             break
//     }
// }

// function getLSBIIN(input){
//     //console.log("LSB IIN: "+input)
//     as_int = Number("0x"+input);
//     (as_int&128) == 128 ? setCheckbox("iin_lsb_device_restart",1) : setCheckbox("iin_lsb_device_restart",0);
//     (as_int&64) == 64 ? setCheckbox("iin_lsb_device_trouble",1) : setCheckbox("iin_lsb_device_trouble",0);
//     (as_int&32) == 32 ? setCheckbox("iin_lsb_local_control",1) : setCheckbox("iin_lsb_local_control",0);
//     (as_int&16) == 16 ? setCheckbox("iin_lsb_need_time",1) : setCheckbox("iin_lsb_need_time",0);
//     (as_int&8) == 8 ? setCheckbox("iin_lsb_class3",1) : setCheckbox("iin_lsb_class3",0);
//     (as_int&4) == 4 ? setCheckbox("iin_lsb_class2",1) : setCheckbox("iin_lsb_class2",0);
//     (as_int&2) == 2 ? setCheckbox("iin_lsb_class1",1) : setCheckbox("iin_lsb_class1",0);
//     (as_int&1) == 1 ? setCheckbox("iin_lsb_all_stations",1) : setCheckbox("iin_lsb_all_stations",0);
//     return "0x"+input
// }

// function getMSBIIN(input){
//     //console.log("MSB IIN: "+input)
//     as_int = Number("0x"+input);
//     (as_int&128) == 128 ? setCheckbox("iin_msb_reserved2",1) : setCheckbox("iin_msb_reserved2",0);
//     (as_int&64) == 64 ? setCheckbox("iin_msb_reserved1",1) : setCheckbox("iin_msb_reserved1",0);
//     (as_int&32) == 32 ? setCheckbox("iin_msb_configuration_corrupt",1) : setCheckbox("iin_msb_configuration_corrupt",0);
//     (as_int&16) == 16 ? setCheckbox("iin_msb_already_executing",1) : setCheckbox("iin_msb_already_executing",0);
//     (as_int&8) == 8 ? setCheckbox("iin_msb_event_buffer_overflow",1) : setCheckbox("iin_msb_event_buffer_overflow",0);
//     (as_int&4) == 4 ? setCheckbox("iin_msb_parameter_error",1) : setCheckbox("iin_msb_parameter_error",0);
//     (as_int&2) == 2 ? setCheckbox("iin_msb_object_unknown",1) : setCheckbox("iin_msb_object_unknown",0);
//     (as_int&1) == 1 ? setCheckbox("iin_msb_function_code_not_supported",1) : setCheckbox("iin_msb_function_code_not_supported",0);
//     return "0x"+input
// }

// function handleApplicationHeader(input){
//     //056414F3010000040A3BC0 C3 01 3C 02 06 3C 03 06 3C 04 06 3C 01 06 9A 12
//     setOutput("application-header-data",input)
//     setOutput("application_control",getApplicationControl(input.substring(0,2)))
//     setOutput("app_function_code",getAppFunctionCode(input.substring(2,4)))
//     //console.log("Length: "+input.length)
//     if (input.length == 8){
//         setOutput("internal_indications_lsb",getLSBIIN(input.substring(4,6)))
//         setOutput("internal_indications_msb",getMSBIIN(input.substring(6,8)))
//     }
// }

// ///////////////////////////////
// //APPLICATION OBJECT HEADERS//
// //////////////////////////////

// function calculateQualifier(qualifier){
//     let as_int = Number("0x"+qualifier)
//     let range_specifier = as_int & 0x0F
//     let range_specifier_resolved = ""
//     let range_size=-1
//     switch (range_specifier){
//         case 0:
//             range_specifier_resolved = "1-octet start - stop indexes."
//             range_size=1
//             break
//         case 1:
//             range_specifier_resolved = "2-octet start – stop indexes."
//             range_size=2
//             break
//         case 2:
//             range_specifier_resolved = "4-octet start – stop indexes."
//             range_size=4
//             break
//         case 3:
//             range_specifier_resolved = "1-octet start – stop virtual addresses."
//             range_size=1
//             break
//         case 4:
//             range_specifier_resolved = "2-octet start – stop virtual addresses."
//             range_size=2
//             break
//         case 5:
//             range_specifier_resolved = "4-octet start – stop virtual addresses."
//             range_size=4
//             break
//         case 6:
//             range_specifier_resolved = "No range field used. Implies all objects."
//             range_size=0
//             break
//         case 7:
//             range_specifier_resolved = "1-octet count of objects."
//             range_size=1
//             break
//         case 8:
//             range_specifier_resolved = "2-octet count of objects."
//             range_size=2
//             break
//         case 9:
//             range_specifier_resolved = "4-octet count of objects."
//             range_size=4
//             break
//         case 10:
//             range_specifier_resolved = "Reserved."
//             break
//         case 11:
//             range_specifier_resolved = "1-octet count of objects (variable format)."
//             range_size=1
//             break
//         case 12:
//             range_specifier_resolved = "Reserved."
//             break
//         case 13:
//             range_specifier_resolved = "Reserved."
//             break
//         case 14:
//             range_specifier_resolved = "Reserved."
//             break
//         case 15:
//             range_specifier_resolved = "Reserved."
//             break
//     }
//     console.log("RANGE SIZE: "+range_size)
//     let object_prefix = as_int>>4 & 0x07
//     let object_prefix_resolved=""
//     let object_prefix_size=-1
//     switch (object_prefix){
//         case 0:
//             object_prefix_resolved="Objs packed without a prefix."
//             object_prefix_size=0
//             break
//         case 1:
//             object_prefix_resolved="Objs prefixed with 1-octet index."
//             object_prefix_size=1
//             break
//         case 2:
//             object_prefix_resolved="Objs prefixed with 2-octet index."
//             object_prefix_size=2
//             break
//         case 3:
//             object_prefix_resolved="Objs prefixed with 4-octet index."
//             object_prefix_size=4
//             break
//         case 4:
//             object_prefix_resolved="Objs prefixed with 1-octet object size."
//             object_prefix_size=1
//             break
//         case 5:
//             object_prefix_resolved="Objs prefixed with 2-octet object size."
//             object_prefix_size=2
//             break
//         case 6:
//             object_prefix_resolved="Objs prefixed with 4-octet object size."
//             object_prefix_size=4
//             break
//         case 7:
//             object_prefix_resolved="Reserved."
//             break
//     }
//     return [range_specifier_resolved,object_prefix_resolved,range_size,object_prefix_size]
// }

// //takes group and variation, returns size in bits
// //divide result by 8 to get bytes, or 2 to get the number of characters
// //returns 0 if not found
// function calculateObjectSize(group,variation){
//     if (group==1 || group==10){
//         if (variation==1){
//             return 1
//         } else if(variation==2){
//             return 8
//         }
//     }else if (group==2 || group==4 || group==11|| group==13){
//         if (variation==1){
//             return 1*8
//         }else if (variation==2){
//             return 7*8
//         }else if (variation==3){
//             return 3*8
//         }
//     }else if (group==3){
//         if (variation==1){
//             return 2
//         }else if (variation==2){
//             return 8
//         }
//     }else if (group==12){
//         if (variation==1 || variation==2){
//             return 11*8 
//         }
//     }else if (group==20){
//         if (variation==1){
//             return 5*8
//         }else if (variation==2){
//             return 3*8
//         }
//         else if (variation==5){
//             return 4*8
//         }
//         else if (variation==6){
//             return 2*8
//         }
        
//     }else if (group==21 || group==22 || group==23){
//         if (variation==1){
//             return 5*8
//         }else if (variation==2){
//             return 3*8
//         }
//         else if (variation==5){
//             return 11*8
//         }
//         else if (variation==6){
//             return 9*8
//         }else if (variation==9){
//             return 4*8
//         }
//         else if (variation==10){
//             return 2*8
//         }
        
//     }else if (group==30){
//         if (variation==1 || variation==5){
//             return 5*8
//         }else if (variation==2){
//             return 3*8
//         }
//         else if (variation==3){
//             return 4*8
//         }
//         else if (variation==4){
//             return 2*8
//         }
//         else if (variation==6){
//             return 9*8
//         }
        
//     }else if (group==31){
//         if (variation==1){
//             return 5*8
//         }else if (variation==2){
//             return 3*8
//         }
//         else if (variation==3){
//             return 11*8
//         }
//         else if (variation==4){
//             return 9*8
//         }
//         else if (variation==5){
//             return 4*8
//         }
//         else if (variation==6){
//             return 2*8
//         }
//         else if (variation==7){
//             return 5*8
//         }
//         else if (variation==8){
//             return 9*8
//         }
//     }else if (group==32 || group==33 || group==42|| group==43){
//         if (variation==1 ){
//             return 5*8
//         }else if (variation==2){
//             return 3*8
//         }
//         else if (variation==3){
//             return 11*8
//         }
//         else if (variation==4){
//             return 9*8
//         }
//         else if (variation==5){
//             return 5*8
//         }
//         else if (variation==6){
//             return 9*8
//         }
//         else if (variation==7){
//             return 11*8
//         }
//         else if (variation==8){
//             return 15*8
//         }
        
//     }else if (group==34){
//         if (variation==1 ){
//             return 2*8
//         }else if (variation==2 || variation==3){
//             return 4*8
//         }
        
//     }else if (group==40 || group==41){
//         if (variation==1 ){
//             return 5*8
//         }else if (variation==2){
//             return 3*8
//         }
//         else if (variation==3){
//             return 5*8
//         }
//         else if (variation==4){
//             return 9*8
//         }
        
//     }else if (group==50){
//         if (variation==1 ){
//             return 6*8
//         }else if (variation==2){
//             return 10*8
//         }
//         else if (variation==3){
//             return 6*8
//         }
//         else if (variation==4){
//             return 11*8
//         }
        
//     }else if (group==51){
//         return 6*8
//     }else if (group==52){
//         return 2*8
        
//     }else if (group==80){
//         return 2*8
        
//     }else if (group==81){
//         return 3*8
        
//     }else if (group==86){
//         if (variation==2){
//             return 8
//         }
        
//     }else if (group==101){
//         if (variation==1 ){
//             return 2*8
//         }else if (variation==2){
//             return 4*8
//         }
//         else if (variation==3){
//             return 8*8
//         }
        
//     }else if (group==102){
//         return 8
//     }else if (group==120){
//         if (variation==4){
//             return 8
//         }
        
//     }else if (group==121){
//         if (variation==1){
//             return 7*8
//         }
        
//     }else if (group==122){
//         if (variation==1){
//             return 7*8
//         } else if (variation==2){
//             return 13*8
//         }
//     }
//     return 0
// }

// function handleApplicationObjects(input){
//     console.log("Application Objects: "+input)
//     let group = Number("0x"+input.substr(0,2)) //first byte
//     let variation = Number("0x"+input.substr(2,2)) //second byte
//     let qualifier = input.substr(4,2) //third byte
//     let qualifier_resolved = calculateQualifier(qualifier)
//     let range_size = qualifier_resolved[2]
//     let range = Number("0x"+MSBLSBSwap(input.substr(6,range_size*2))) //swap msb and lsb and convert to decimal
//     let object_prefix_size = qualifier_resolved[3]
//     let length_pre_data = 6+range_size*2
//     let index = Number("0x"+MSBLSBSwap(input.substr(6+range_size*2,object_prefix_size*2))) //swap msb and lsb and convert to decimal
//     let objectSize = calculateObjectSize(group,variation) //get object size in bits
//     let data = input.substr(length_pre_data)
    
//     let data_chunk_length = (object_prefix_size*2)+(objectSize/4)
//     console.log("!!!!:"+data_chunk_length)

//     console.log("Group: "+group)
//     console.log("Variation: "+variation)
//     console.log("Qualifier: "+qualifier)
//     console.log("Range Specifier: "+qualifier_resolved[0]+"\nObject Prefix: "+qualifier_resolved[1])
//     console.log("Object Prefix Size: "+object_prefix_size)
//     console.log("Range: " +range)
//     console.log("Object Size (bits): " +objectSize)
//     console.log("Index: "+index)
//     console.log("Data: "+data)
//     console.log("===============================")

//     let offset=0
//     let data_chunk = ""
//     for (let i=0;i<range;i++){
//         data_chunk = input.substr(length_pre_data+offset,data_chunk_length)
//         console.log("Data Chunk: "+data_chunk)
//         console.log("Index: "+Number("0x"+MSBLSBSwap(data_chunk.substr(0,object_prefix_size*2))))
//         console.log("Quality: "+data_chunk.substr(object_prefix_size*2,2))
//         console.log("Value: "+data_chunk.substr(object_prefix_size*2+2))
//         console.log("------------------------------")
//         offset +=data_chunk_length
//     }

//     // if (input.length>length_pre_data+objectSize){
//     //     handleApplicationObjects(input.substring(length_pre_data+objectSize))
//     // }

// }

// function main(input){
//     //console.log(input)
//     if (input.length < 20){
//         return console.log("Input too short...")
//     }

//     handleDataLinkLayer(input.substring(0,20))
//     handleTransportLayer(input.substring(20,22))
//     var objects=""
//     input = stripCRC(input.substr(20))
//     if ((Number("0x"+input.substring(6,8))>>7 & 0x1) == 1){
//         console.log("marco")
//         handleApplicationHeader(input.substring(2,6))
//         objects=input.substring(6)
//     } else{
//         console.log("polo")
//         handleApplicationHeader(input.substring(2,10)) //Internal Indications only included in responses from outstation.
//         objects=input.substring(10)
//     }

//     handleApplicationObjects(objects)
// }


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
    //console.log("Setting: "+id+" to: "+value)
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
    //console.log(msb)
    lsb = data.substr(2)
    //console.log(lsb)
    return String(lsb)+String(msb)
}