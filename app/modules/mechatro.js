/********************************************************
 * 명명 규칙
 *
 * 함수명, 변수명 : 첫 글자 소문자, 다음 단어 첫 글자 대문자, 두단어 이상 조합    예) nameRull
 * 키  값 : 모두 대문자, 단어사이 '_' 사용함                                   예) NAME_RULL
 *
 *********************************************************/
/* update 내용
   디지털 입력 업데이트 방법 변경 : 코딩에 사용된 디지털 포트만 -> 모두 업데이트
*/

const BaseModule = require('./baseModule');

class mechatro extends BaseModule {
    // 클래스 내부에서 사용될 필드들을 이곳에서 선언합니다.
    constructor() {
        super();
        this.entryJS_State = 0;

        this.remainData = 0;

        this.dataFromEntry = {};
        // 형식
        // dataFromEntry = {
        //     portNo: {
        //         MODE: 0,
        //         VALUE: 0,
        //         UPDATE: 2,  // 업데이트 횟수 셋팅
        //     },
        // }

        this.dataFromDevice = {};
        // 형식
        // this.dataFromDevice = {
        //     ULTRASONIC: 0,
        //     '2': 0,
        // 
        //     '21': 0,
        // };

        this.setMode = {
            SET_GROUP_COMMAND: 0x80,
            SET_INIT_DEVICE: 0x80,
            SET_PORT_DISABLE: 0x81,
            SET_BLUE_PW: 0x82,
            SET_NO_TONE: 0x83,
            SET_MOTOR_CURRENT: 0x84,    //엔트리에서 수신하는 값, 포트번호와 함께 수신됨
            SET_MOTOR_CURRENT_A: 0x84,  // 포트번호에 따라 값 선택 후 HW에 전송
            SET_MOTOR_CURRENT_B: 0X85,  // 포트번호에 따라 값 선택 후 HW에 전송

            SET_MOTOR_SPEED_Free: 0x88,
            SET_MOTOR_SPEED_Fast: 0x8C,

            SET_GROUP_D_OUT: 0xa0,
            SET_DIGITAL_OUT_L: 0xa0,
            SET_DIGITAL_OUT_H: 0xb0,

            SET_GROUP_SERVO_PWM_TON: 0xc0,
            SET_SERVO_POSITION: 0xc0,
            SET_SERVO_SPEED: 0xc8,
            SET_PWM: 0xd0,
            SET_TONE: 0xd8,

            SET_GROUP_INPUT: 0xe0,
            SET_ANALOG_IN: 0xe0,
            SET_DIGITAL_IN_L: 0xe8,
            SET_DIGITAL_IN_H: 0xf0,
            SET_ULTRASONIC: 0xf8,
        };

        this.getMode = {
            COM_GROUP: 0x80,
            COM_INIT_DEVICE: 0x81,
            COM_PORT_DISABLED: 0x82,
            COM_BLUETOOTH_PW_OK: 0x83,
            COM_BLUETOOTH_PW_ERR: 0x84,

            GET_DIGITAL_IN: 0x88,
            GET_DIGITAL_is_H_port: 0x02,
            // GET_ANALOG_IN: 0x90~0xF8, ( 아날로그 포트 모드 구분 불필요 --> 삭제 22.3.26)
        };

        this.portMapToDevice = {
            INOUT_L_H: {
                //IN/OUT, ULTRASONIC, TON
                '2': 0, // Start L Bit
                '4': 1,
                '5': 2,
                '6': 3,
                '7': 4,
                '10': 5, // END L Bit
                '16': 0, // Start H Bit
                '17': 1,
                '18': 2,
                '19': 3, // End H Bit
            },
            SERVO: {
                '2': 0,
                '5': 1,
                '6': 2,
                '10': 3,
                '22': 0,
                '23': 1,
                '24': 2,
                '25': 3,
            },
            PWM: {
                '5': 0,
                '6': 1,
                '9': 2,
                '10': 3,
            },
            MOTOR: {
                '3': 0,
                '11': 1,
            },
        };

        this.portMapToEntry = {
            DIGITAL_L: {
                '0': 2,
                '1': 4,
                '2': 5,
                '3': 6,
                '4': 7,
                '5': 10,
            },
            DIGITAL_H: {
                '0': 16,
                '1': 17,
                '2': 18,
                '3': 19,
            },
            ANALOG: {
                '2': 2,
                '3': 4,
                '4': 5,
                '5': 6,
                '6': 7,
                '7': 10,
                '8': 14,    // MA motor current
                '9': 15,    // MB motor current
                '10': 16,
                '11': 17,
                '12': 18,
                '13': 19,
                '14': 20,
                '15': 21,
            },
        };
    }

    initDataFromEntryStopState() {
        this.dataFromEntry = {
            '2': {
                MODE: this.setMode.SET_DIGITAL_IN_L,
                UPDATE: 0,
            },
            '4': {
                MODE: this.setMode.SET_DIGITAL_IN_L,
                UPDATE: 0,
            },
            '5': {
                MODE: this.setMode.SET_DIGITAL_IN_L,
                UPDATE: 0,
            },
            '6': {
                MODE: this.setMode.SET_DIGITAL_IN_L,
                UPDATE: 0,
            },
            '7': {
                MODE: this.setMode.SET_DIGITAL_IN_L,
                UPDATE: 0,
            },
            '10': {
                MODE: this.setMode.SET_DIGITAL_IN_L,
                UPDATE: 0,
            },
            '14': {
                MODE: this.setMode.SET_PORT_DISABLE,
                UPDATE: 0,
            },
            '15': {
                MODE: this.setMode.SET_PORT_DISABLE,
                UPDATE: 0,
            },
            '16': {
                MODE: this.setMode.SET_ANALOG_IN,
                UPDATE: 0,
            },
            '17': {
                MODE: this.setMode.SET_ANALOG_IN,
                UPDATE: 0,
            },
            '18': {
                MODE: this.setMode.SET_ANALOG_IN,
                UPDATE: 0,
            },
            '19': {
                MODE: this.setMode.SET_ANALOG_IN,
                UPDATE: 0,
            },
            '20': {
                MODE: this.setMode.SET_ANALOG_IN,
                UPDATE: 0,
            },
            '21': {
                MODE: this.setMode.SET_ANALOG_IN,
                UPDATE: 0,
            },
        };
        this.dataFromDevice['com'] = 'stop';
    }

    /*
    최초에 커넥션이 이루어진 후의 초기 설정.
    handler 는 워크스페이스와 통신하 데이터를 json 화 하는 오브젝트입니다. (datahandler/json 참고)
    config 은 module.json 오브젝트입니다.
    */
    init(handler, config) {
        this.handler = handler;
        this.config = config;
        this.initDataFromEntryStopState();
    }

    /*
    하드웨어 기기에 전달할 데이터를 반환합니다.
    하드웨어 연결되면 계속 실행
    slave 모드인 경우 duration 속성 간격으로 지속적으로 기기에 요청을 보냅니다.*/

    requestLocalData() {
        //console.log("        ■ -->> Device: ");
        const queryString = [];
        let query;
        let mode;
        let value;
        let modeGroup;
        let idx;
        //console.log("dataFromEntry : ", this.dataFromEntry);
        //console.log("set 4 entryJS_State ", this.entryJS_State);

        if (this.entryJS_State == 0) {  // 하드웨어 연결 or 엔트리 stop시 초기화 , 포트 모드 초기화
            this.entryJS_State = 1;
            queryString.push(this.setMode.SET_INIT_DEVICE);
            queryString.push(0);
            queryString.push(this.setMode.SET_INIT_DEVICE);
        }

        Object.keys(this.dataFromEntry).forEach((portNo) => {
            //console.log('portkeys.forEach ');
            if (this.dataFromEntry[portNo].UPDATE) {
                mode = this.dataFromEntry[portNo].MODE;
                modeGroup = mode & 0xe0;
                value = this.dataFromEntry[portNo].VALUE;
                this.dataFromEntry[portNo].UPDATE--;
                //console.log("Send Data : [", portNo, "] = ", this.dataFromEntry[portNo]);
                switch (modeGroup) {
                    case this.setMode.SET_GROUP_COMMAND:
                        switch (mode) {
                            case this.setMode.SET_MOTOR_SPEED_Free:
                                //Data1
                                idx = this.portMapToDevice.MOTOR[portNo];
                                query = mode + ((value >> 6) & 0x02) + idx;
                                queryString.push(query);
                                //Data2
                                query = value & 0x7f;
                                queryString.push(query);
                                break;
                            case this.setMode.SET_MOTOR_CURRENT:
                                if (portNo == 14) {  // A0 : SEN_A
                                    query = this.setMode.SET_MOTOR_CURRENT_A;
                                } else {             // A1 : SEN_B
                                    query = this.setMode.SET_MOTOR_CURRENT_B;
                                }
                                queryString.push(query);
                                break;
                            case this.setMode.SET_NO_TONE:
                                query = mode;
                                queryString.push(query);
                                this.dataFromDevice[portNo] = '0';   // 아웃풋 데이터 모니터링 창에 값  업데이트  되도록 저장
                                break;
                            case this.setMode.SET_BLUE_PW:
                                query = this.setMode.SET_BLUE_PW;
                                queryString.push(query);

                                query = parseInt(value / 100, 10);
                                queryString.push(query);

                                query = value - parseInt(value / 100, 10) * 100;
                                queryString.push(query);
                                break;
                        }
                        break;
                    case this.setMode.SET_GROUP_D_OUT:
                        idx = this.portMapToDevice.INOUT_L_H[portNo];
                        query = mode + (value << 3) + idx;
                        queryString.push(query);
                        this.dataFromDevice[portNo] = value;  // 아웃풋 데이터 모니터링 창에 값  업데이트  되도록 저장
                        break;
                    case this.setMode.SET_GROUP_SERVO_PWM_TON:
                        switch (mode) {
                            case this.setMode.SET_SERVO_POSITION:
                                //Data1
                                idx = this.portMapToDevice.SERVO[portNo];
                                query = mode + ((value >> 5) & 0x4) + idx;
                                queryString.push(query);
                                //Data2
                                query = value & 0x7f;
                                queryString.push(query);
                                this.dataFromDevice[portNo] = value;    // 아웃풋 데이터 모니터링 창에 값  업데이트  되도록 저장
                                break;
                            case this.setMode.SET_SERVO_SPEED:
                                //Data1
                                idx = this.portMapToDevice.SERVO[portNo];
                                query = mode + ((value >> 5) & 0x4) + idx;
                                queryString.push(query);
                                //Data2
                                query = value & 0x7f;
                                queryString.push(query);
                                break;
                            case this.setMode.SET_PWM:
                                //Data1
                                idx = this.portMapToDevice.PWM[portNo];
                                query = mode + idx;
                                queryString.push(query);
                                //Data2
                                query = value & 0x7f;
                                queryString.push(query);
                                this.dataFromDevice[portNo] = value;   // 아웃풋 데이터 모니터링 창에 값  업데이트  되도록 저장
                                break;
                            case this.setMode.SET_TONE:
                                //Data1
                                idx = this.portMapToDevice.INOUT_L_H[portNo];
                                query = mode + idx;
                                queryString.push(query);
                                //Data2
                                queryString.push(value);
                                this.dataFromDevice[portNo] = 'tone';  // 아웃풋 데이터 모니터링 창에 값  업데이트  되도록 저장
                                //console.log("SET_TONE[",portNo,"]",query," - ", value);
                                break;
                        }
                        break;
                    case this.setMode.SET_GROUP_INPUT:
                        //console.log('SET_GROUP_INPUT');
                        switch (mode) {
                            case this.setMode.SET_ANALOG_IN:
                                idx = this.portMapToDevice.INOUT_L_H[portNo];
                                query = mode + idx;
                                queryString.push(query);
                                break;
                            case this.setMode.SET_DIGITAL_IN_L:
                                idx = this.portMapToDevice.INOUT_L_H[portNo];
                                query = mode + idx;
                                queryString.push(query);
                                //console.log("SET_DIGITAL_IN_L : ", portNo, " data:", query);
                                break;
                            case this.setMode.SET_DIGITAL_IN_H:
                                idx = this.portMapToDevice.INOUT_L_H[portNo];
                                query = mode + idx;
                                queryString.push(query);
                                //console.log("SET_DIGITAL_IN_H : ", portNo, " data:", query);
                                break;
                            case this.setMode.SET_ULTRASONIC:
                                //Data1
                                idx = this.portMapToDevice.INOUT_L_H[portNo]; //trig pin
                                value = this.portMapToDevice.INOUT_L_H[value]; // the original value is echo portNo

                                query = mode + idx;
                                queryString.push(query);
                                //console.log("Data1 = "+ query);
                                //Data2
                                queryString.push(value);
                                //console.log("Data2 = "+ value);
                                break;
                        }
                        break;
                }
            }
        });

        if (queryString.length > 0) {
            //queryString.unshift(this.setMode.SET_PORT_DISABLE); // Disable 명령 별도 송부로 삭제
            // console.log("Data to Device: ", queryString);
            return queryString;
        } else {
            return null;
        }
    }

    getAnalogData(portNo, data1, data2) {
        //b0011 1000 0000 = 0x380
        this.dataFromDevice[portNo] = ((data1 << 7) & 0x380) | data2;
    }

    getDigitalData(data1, data2) {
        let portMap;
        if (data1 & this.getMode.GET_DIGITAL_is_H_port) { //H Bit
            portMap = this.portMapToEntry.DIGITAL_H;
        } else {  // L Bit
            portMap = this.portMapToEntry.DIGITAL_L;
        }
        Object.entries(portMap).forEach(([key, portNo]) => {
            if (this.dataFromEntry[portNo].MODE == this.setMode.SET_DIGITAL_IN_L
                || this.dataFromEntry[portNo].MODE == this.setMode.SET_DIGITAL_IN_H) {
                this.dataFromDevice[portNo] = (data2 >> key) & 0x01;
            }
        });
    }

    // 하드웨어에서 온 데이터 처리, 하드웨어 연결되면 주기적인 실행.
    handleLocalData(data) {
        //this.dataFromDevice = {};  // 엔트리 쪽을 상시 값 전송
        let modeGroup;
        let portkey;

        if (this.remainData) {
            modeGroup = this.remainData & 0xf8; // b1111 1000
            switch (modeGroup) {
                case this.getMode.GET_DIGITAL_IN:
                    this.getDigitalData(this.remainData, data[0]);
                    break;
                default: // this.getMode.GET_ANALOG_IN:
                    portkey = (this.remainData >>> 3) & 0x0F;
                    this.getAnalogData(this.portMapToEntry.ANALOG[portkey], this.remainData, data[0]);
            }
            this.remainData = 0;
        }

        data.forEach((getValue, idx) => {
            if (getValue & 0x80) { // b1000 0000 DATA1 일 때 실행
                modeGroup = getValue & 0xf8; // b1111 1000
                switch (modeGroup) {
                    case this.getMode.COM_GROUP:
                        switch (getValue) {
                            case this.getMode.COM_INIT_DEVICE:
                                //console.log(" <--COM_INIT_DEVICE");
                                break;
                            /* case this.getMode.COM_PORT_DISABLED:  모든 포트 상시 업데이트로 변경하면서 쓰지 않음.
                                this.dataFromDevice['com'] = 'Run';
                                break; */
                            case this.getMode.COM_BLUETOOTH_PW_OK:
                                this.dataFromDevice['com'] = 'PW 0K';
                                break;
                            case this.getMode.COM_BLUETOOTH_PW_ERR:
                                this.dataFromDevice['com'] = 'PW FAIL';
                                break;
                        }
                        break;
                    case this.getMode.GET_DIGITAL_IN:
                        if (data[idx + 1] === undefined) {
                            this.remainData = getValue;
                            //console.log( "     ■ <-- Rmode_D: ", getValue);
                        } else {
                            // this.remainData = 0;
                            this.getDigitalData(getValue, data[idx + 1]);
                        }
                        break;
                    default: // this.getMode.GET_ANALOG_IN:
                        if (data[idx + 1] === undefined) {
                            this.remainData = getValue;
                        } else {
                            //this.remainData = 0;
                            portkey = (getValue >>> 3) & 0x0F;
                            this.getAnalogData(this.portMapToEntry.ANALOG[portkey], getValue, data[idx + 1]);
                        }
                }
            }
        });
    }

    // 엔트리로 전달할 데이터, 하드웨어 연결되면 주기적인 실행.
    requestRemoteData(handler) {
        //console.log("Entry <<-- ■");
        //console.log("dataFromDevice data: ", this.dataFromDevice );
        Object.keys(this.dataFromDevice).forEach((key) => {  // key.length ===0 이면 실행 되지 않음.
            handler.write(key, this.dataFromDevice[key]);
        });
    }

    /* 엔트리에서 받은 데이터에 대한 처리
       엔트리 실행 중지시에는 작동 안함
       엔트리가 중지 되면 SetZero 에서 Entry.hw.update() 를 통해 SEND_DATA : {} 값이 들어옴.*/
    handleRemoteData(handler) {
        const getData = handler.read('SEND_DATA');
        const getkeys = Object.keys(getData);
        //console.log(getData);
        if (getkeys.length) {
            if (this.entryJS_State == 1) {   // 1(엔트리 정지로 초기화 완료) --> 2(엔트리 RUN 상태 블록 사용 시작)
                this.entryJS_State = 2;
                this.dataFromDevice['com'] = 'run';
                //console.log(" EntryJS State : 0 -> 1");
            }

            getkeys.forEach((portNo) => {
                if (!Object.prototype.hasOwnProperty.call(this.dataFromEntry, portNo)) {
                    //console.log("this.dataFromEntry[", portNo, "]:", this.dataFromEntry[portNo]);
                    this.dataFromEntry[portNo] = {};
                }
                Object.keys(getData[portNo]).forEach((key) => {
                    if (!Object.prototype.hasOwnProperty.call(this.dataFromEntry[portNo], key)) {
                        //console.log("this.dataFromEntry[", portNo, "][", key, "]:", this.dataFromEntry[portNo][key]);
                        this.dataFromEntry[portNo][key] = undefined;
                    }
                    if (this.dataFromEntry[portNo][key] != getData[portNo][key]) {
                        this.dataFromEntry[portNo][key] = getData[portNo][key];
                        this.dataFromEntry[portNo].UPDATE = 2;
                        //console.log("Data From Entry[", portNo, "] : ", this.dataFromEntry[portNo]);
                    }
                });
            });
        }
        else if (this.entryJS_State == 2) {
            //console.log("Entry stop");
            this.initDataFromEntryStopState();
            this.entryJS_State = 0;
        }
        //console.log("dataFromEntry = ", this.dataFromEntry);
    }

    /*
    연결 후 초기에 송신할 데이터가 필요한 경우 사용합니다.
    requestInitialData 를 사용한 경우 checkInitialData 가 필수입니다.
    이 두 함수가 정의되어있어야 로직이 동작합니다. 필요없으면 작성하지 않아도 됩니다.
    */
    //requestInitialData() {
    // //console.log("requestInitialData");
    // return null;
    //}

    // 연결 후 초기에 수신받아서 정상연결인지를 확인해야하는 경우 사용합니다.
    //checkInitialData(data, config) {
    // //console.log("checkInitialData");
    // return true;
    //}

    // 주기적으로 하드웨어에서 받은 데이터의 검증이 필요한 경우 사용합니다.
    //validateLocalData(data) {
    // return true;
    //}

}

module.exports = new mechatro();
