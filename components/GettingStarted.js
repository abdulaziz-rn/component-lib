
import React, { useState, useEffect, Component } from 'react';
import { View, Text, Image, Platform, Dimensions, StyleSheet, TouchableOpacity, NativeModules, I18nManager,  StatusBar, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react'
import SvgIcon from 'react-native-svg-icon';
import svgs from '../assets/svg';
import { CButton, CText } from '../components'
import { theme } from '../theme'
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modal'
import AsyncStorage from '@react-native-community/async-storage';
import { Language } from '../ts';
export const { width, height } = Dimensions.get('window');
const IKON = (props) => <SvgIcon {...props} svgs={svgs} />
import RNRestart from 'react-native-restart'
import { INITIAL_SETUP } from '../utility/keyStrings';
import { getSelectedCountry } from '../utility/common';
import CRadioButton from '../components/common/CRadioButton'
import { userImg, getstarted_backgroundImg } from '../assets/images'
import CountryLangEnModal from '../../src/components/CountryLangEnModal'
import { vw } from '../../src/utility/viewport-units'
const lang = [{ key: "العربية", value: "ar" }, { key: "English", value: "en" }]
import { SafeAreaView } from 'react-native-safe-area-context';
import { getString } from '../utility/language';
import { getLocation } from '../utility/localStorage';
import _ from 'lodash'
import { setSingleHeader } from '../services/common';
@inject('authentication', 'common', 'sanar')
@observer export class GettingStarted extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            langVal: 'ar',
            isModal: false,
            countryCode: 'SA',
            selectedValues: {
                name: "Saudi Arabia",
                flag: "🇸🇦"
            },
        }
    }

    async selectedLanguage(value) {}

    async continue () {
        const { sanar, authentication } = this.props
        await sanar.setLanguage(this.state.langVal)
        await sanar.onGettingStartedConfirm()
        if(this.state.langVal==Language.English) {
            RNRestart.Restart()
        } else {
            sanar.locationSetup(authentication.geocodeProvider);
            this.props.onStartUpConfirm()
        }
    }

    async setCountry() {
        const { common, authentication, sanar } = this.props
        let selectedCountry = authentication.masterData.country_list.find( c => c.code == this.state.countryCode)
        this.setState(state => (
            state.selectedValues.name = selectedCountry.name,
            state.selectedValues.flag = selectedCountry.flag,
            state.countryCode = selectedCountry.code
        ))
        await sanar.setCountry(selectedCountry.code)
    }

    render() {
        const { common, sanar } = this.props
        const scrollEnabled = this.state.screenHeight > height;
        return (
            <Modal
                isVisible={sanar.isGettingStarted}
                propagateSwipe={false}
                coverScreen={true}
                backdropColor={"black"}
                backdropOpacity={0.1}
                animationInTiming={300}
                animationOutTiming={300}
                swipeThreshold={50}
                backdropTransitionInTiming={1000}
                backdropTransitionOutTiming={1000}
                style={{ width: width, height: height, backgroundColor: 'white', margin: 0 }}>
                <SafeAreaView style={styles.container}>
                    <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
                    <View style={{ flex:2 }}>
                        {/* <CText style={styles.txtGetStrted}>{getString("getstrted")}</CText> */}
                        <CText style={styles.txtDesc}>Welcome to Sanar</CText>
                        <CText style={styles.txtDesc}>مرحبا بك في سنار</CText>
                        <Image style={[styles.imgBackground]} resizeMode={'contain'} source={getstarted_backgroundImg} />
                    </View>
                    <View style={[styles.viewCountry, styles.columnStyle]}>
                        <View style={styles.viewPlzSelect}>
                            <CText style={styles.txtSelectCountry}>{getString("plzselectur")}</CText>
                            <CText style={styles.txtCountryBold}>{getString("contry")}</CText>
                        </View>
                        <Text style={styles.txtArSelectCountry}>اختر بلدك</Text>
                        <TouchableOpacity onPress={() => this.setState({ isModal: true })}>
                            <View style={styles.viewSelectCountry}>
                                <View style={{ flexDirection:'row-reverse' }}>
                                    <View style={styles.viewCountryContent}>
                                        <CText style={{marginRight: 20}}>{this.state.selectedValues.flag}</CText>
                                        <CText style={styles.txtCountry}>{this.state.selectedValues.name}</CText>
                                    </View>
                                    <View style={styles.viewDrpDwn}>
                                        <IKON name={"chevrondown"} height={12} width={12} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <CountryLangEnModal
                            country={true}
                            isModal={this.state.isModal}
                            disableModal={() => this.setState({ isModal: false })}
                            countrySelect={ (data) => this.setState({ countryCode: data.code }) }
                            onCountrySave={() => this.setState({ isModal: false }, () => this.setCountry())}
                            code={this.state.countryCode} />
                    </View>
                    <View style={[styles.viewCountry, styles.columnStyle]}>
                        <View style={[styles.viewPlzSelect]}>
                            <CText style={styles.txtSelectCountry}>{getString("plzselectur")}</CText>
                            <CText style={styles.txtCountryBold}>{getString("lnguage")}</CText>
                        </View>
                        <Text style={styles.txtArSelectCountry}>الرجاء اختيار اللغة</Text>
                        <View style={{ flexDirection:'row-reverse'}}>
                            {
                                lang.map((data, index) => {
                                    return (
                                        <View style={styles.viewArabic} key={index}>
                                            <View style={styles.subViewAr}>
                                                <CRadioButton 
                                                    style={styles.radioBtnStyle} 
                                                    isState={this.state.langVal == data.value} 
                                                    onPress={() => { this.setState({ langVal: data.value }, () => this.selectedLanguage(data.value)) }} />
                                                <CText>{data.key}</CText>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                        
                    <View style={{  }}>
                        <CButton title="Continue" style={styles.buttonContainerStyle} onPress={() => this.continue()} textStyle={styles.btnText} buttonStyle={{ borderRadius: 4 }} />
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }
}


// tslint:disable:no-magic-numbers
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 30
    },
    txtGetStrted: {
        fontFamily: theme.fontFamily.bold,
        fontSize: theme.fonts.font16,
        textAlign: 'center',
        marginTop: 10
    },
    txtDesc: {
        fontFamily: theme.fontFamily.regular,
        fontSize: theme.fonts.font13,
        textAlign: 'center',
        marginTop: 5,
        //color: '#A4A4A4'
    },
    imgBackground: {
        marginTop: 10,
        alignSelf: 'center',
        width: '100%',
        // height: 180,
        flex:1,
        height: vw*30,
    },
    columnStyle: {
        // flex: 2,
        marginVertical: 10,
    },
    viewCountry: {
        shadowOffset: {
            width: 0,
            height: 0.5
        },
        shadowRadius: 4,
        shadowOpacity: 0.8,
        shadowColor: theme.colors.lightShodowColor,
        elevation: 3,
        borderRadius: 8,
        borderColor: 'grey',
        backgroundColor: 'white',
        justifyContent:'center',
        height: vw*40,
    },
    txtSelectCountry: {
        fontFamily: theme.fontFamily.poppins,
        fontSize: theme.fonts.font15,
        marginRight: 20,
        marginTop: 20,
    },
    txtCountryBold: {
        fontFamily: theme.fontFamily.medium,
        fontWeight: '600',
        fontSize: theme.fonts.font15,
        marginRight: 3,
        marginTop: 20,
    },
    txtArSelectCountry: {
        fontSize: theme.fonts.font15,
        marginRight: 20,
        marginTop: 5,
        fontFamily: theme.fontFamily.regular,
        textAlign: 'right'
    },
    viewSelectCountry: {
        backgroundColor: '#EFF8FF',
        height: vw*12,
        marginHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        marginBottom: 15,
        marginTop: 15,
    },
    viewCountryContent: {
        marginRight: 20,
        flex: 3,
        flexDirection:'row-reverse',
        alignItems: 'center'
    },
    txtCountry: {
        textAlign: 'left',
        color: theme.colors.text_common,
        marginRight: 10,
        fontSize: theme.fontFamily.font12
    },
    viewArabic: {
        backgroundColor: '#EFF8FF',
        height: vw*12,
        borderRadius: 8,
        justifyContent: 'center',
        marginBottom: 15,
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
        // width: 130,
        flex:1
    },
    subViewAr: {
        marginLeft: 5,
        flexDirection:'row-reverse',
        flex: 1,
        alignItems: 'center',
    },
    radioBtnStyle: {
        borderWidth: 1,
        borderColor: theme.colors.blue
    },
    buttonContainerStyle: {
        marginHorizontal: 0,
        flexGrow: 1,
        marginTop: 20,
        borderRadius: 8,
    },
    btnText: {
        marginVertical: 5,
        fontFamily: theme.fontFamily.regular,
        fontSize: theme.fonts.font11
    },
    viewDrpDwn: {
        marginLeft: 20,
        alignItems: 'flex-start',
        flex: 1,
        justifyContent: 'center'
    },
    viewPlzSelect: {
        flexDirection:'row-reverse', 
        alignItems:'center'
    }
});

export { styles };


export default GettingStarted