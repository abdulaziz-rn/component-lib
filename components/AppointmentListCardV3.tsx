import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableOpacity, I18nManager } from 'react-native'
import React, { useState } from 'react'
import { CText } from '../../components';
import { getString } from '../../utility/language';
import { IKON } from '../../components';
import { theme } from '../../theme';
import NewCountDown from '../../components/common/NewCountDown';
import moment from 'moment';
import _ from 'lodash'
import { getTimer, hideAndShowChatButton } from '../../components/MyAppointments/AppointmentUtil';
import { DefaultUserImg } from '../../assets/images';
import { BookAgain } from '../../components/MyAppointments';
const AppointmentListCardV3 = (props:any) => {
  const { onAppointmentPress, onRescheduleItemPress, navigateTochatScreen, onBookFromPending, loader, timestamp, list, } = props;
  const [showTimer, setshowTimer] = useState(false)
  const [enableJoinNow, setenableJoinNow] = useState(false)
  const [onEndReached, setonEndReached] = useState(false)

  const joinNowBtn = (item: any) => {
    return (
      <TouchableOpacity style={styles.joinNowBtn} onPress={() => navigateTochatScreen(item)}>
        <IKON
          name="joinIKon"
          height={18}
          width={18}
          style={[{ marginRight: 6, }, I18nManager.isRTL && { transform: [{ rotateY: '180deg' }] }]}

        />
        <Text style={styles.joinTxt}>{getString("join_now")}</Text>
      </TouchableOpacity>
    )
  }
  const timerView = (item: any) => {

    if (item.status == 0 && item.stid == "ST1") {
      const timeZone = item.timezone ? item.timezone : 'Asia/Riyadh';
      const date = item.date + ' ' + item.slt_tym;
      const startdate = moment(date, 'YYYY-MM-DD-HH:mm');
      const { checker } = getTimer(item);
      var timeseconds = moment(startdate).tz(timeZone).format('YYYY-MM-DD HH:mm')
      if (checker > -60 && checker <= 0) {
        return (
          <NewCountDown key={JSON.stringify(item)} slt_dur={item.slt_dur} appointmentDate={item.date + " " + item.slt_tym} timeZone={item.timezone} extraTime={timestamp} until={timeseconds}
            updateTimer={(x) => updateValues(x)} />
        )
      }
    } else {
      return <></>
    }
  }

  const keyExtractor = (item: any) => JSON.stringify(item);

  const emptyComponent = () => {
    return (
      <View style={styles.emptyList_container}>
        <IKON name="noappointments" width={80} height={80} />
        <CText style={{ marginTop: 20 }}>{getString('no_appointments')}</CText>
      </View>
    );
  }

  const bottomView = () => {
    return (
      <View>
        {props.fetchingStatus ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.blue}
            style={{ marginLeft: 6, marginBottom: 20, marginTop: 10 }}
          />
        ) : null}

      </View>
    );
  }
  const updateValues = (x: any) => {
    if (x === "end") {
      setenableJoinNow(false)
      setshowTimer(false)

    } else if (x === "start") {
      setenableJoinNow(true)
      setshowTimer(false)
    } else if (x == "timer") {
      setenableJoinNow(false)
      setshowTimer(false)
      //this.setState({ enableJoinNow: false, showTimmer: false })
    } else if (x == 'finsih') {
      setenableJoinNow(true)
      setshowTimer(false)
      // this.setState({ enableJoinNow: true, showTimmer: false })
      //this.props.refershList()
    }

  }
  const renderInsButton = (item: any, onBookFromPending: any) => {
    return (
      <TouchableOpacity onPress={() => onBookFromPending(item)}
        style={{alignSelf: 'flex-start', backgroundColor: theme.colors.primary, alignItems: 'center', paddingVertical: 10, borderRadius: 5,paddingHorizontal: 12 }}>
        <Text style={{ color: theme.colors.white }}>
          {item.insStatusCode == 2 || item.insStatusCode == 3 ? getString('book_now') : getString('proceed_payment')}
        </Text>
      </TouchableOpacity>
    )
  }


  const upcomingCardview = (item: any) => {
    return (
      <View>
        {item.isReschedule ?
          <TouchableOpacity style={styles.reschedule} onPress={() => onRescheduleItemPress(item)}>
            <Text style={styles.rescheduleTxt}>{getString("re_shedule")}</Text>
          </TouchableOpacity> : null}
        {item.stid == "ST1" && (hideAndShowChatButton(item, timestamp) || enableJoinNow) ? joinNowBtn(item) : null}
        {timerView(item)}
      </View>
    )

  }
  const completedCardview = (item: any) => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row',marginHorizontal:-5 }}>
          {item.waiting_report ?
            <View style={styles.waitingView}>
              <Text style={styles.waitingtxt}>{getString("waiting_report") || ('Waiting for report issue...')}</Text>
            </View> : null}
          {item.prescriptionDetails && item.prescriptionDetails.prescription_id ?

            <TouchableOpacity style={styles.buttonView} onPress={() => props.viewPrescription(item)}>
              <Text style={styles.prescriptionTXt}>{getString("presc")}</Text>
            </TouchableOpacity> : null}
          {item.med_report && item.med_report.length > 2 ?
            <TouchableOpacity style={styles.buttonView} onPress={() => props.viewReport(item)}>
              <Text style={styles.prescriptionTXt}>{getString("view_report")}</Text>
            </TouchableOpacity> : null}
          {item.re_book?
            <BookAgain
              appointmentdetails={item}
              navigation={props.navigation}
            //   showLoader={showLoader =>
            //     this.setState({ transparentLoader: showLoader })
            //   }
            /> : null
          }

          {item.tat ?
            <View style={styles.tatView}>
              <Text style={styles.tattxt}>{getString("estimated_result") || ('Estimated result time:')}</Text>
              <Text style={styles.timetxt}>{getString("estimated_result") || (' in 12hrs')}</Text>

            </View> : null}


        </View>
        {item.donor_card_link && item.donor_card_link ?

          <TouchableOpacity style={styles.buttonView} onPress={() => props.viewDonarCard(item)}>
            <IKON
              name="donorCard"
              height={20}
              width={20}
              style={{ marginHorizontal: 5 }} />
            <Text style={styles.prescriptionTXt}>{getString("donar_card")}</Text>
          </TouchableOpacity> : null}
        <View style={{ flexDirection: 'row' }}>
          {item.results_avlb ?
            <TouchableOpacity style={styles.viewButton} onPress={() => props.viewResult(item)}>
              <Text style={styles.prescriptionTXt}>{getString("view_result")}</Text>
            </TouchableOpacity> : null}
          {item.read_result && !_.isEmpty(item.read_result) ?

            <TouchableOpacity style={styles.readView} onPress={() => props.readResult(item)}>
              <Text style={styles.readTXt}>{getString("read_result")}</Text>
            </TouchableOpacity>
            : null}

        </View>
        <View style={{ flexDirection: 'row' }}>
          {item.results_avlb ?
            <TouchableOpacity style={styles.resultButton} onPress={() => props.viewResult(item)}>
              <Text style={styles.prescriptionTXt}>{getString("view_result")}</Text>
            </TouchableOpacity> : null}
          {item.result_doctor ?
            <TouchableOpacity style={styles.doctorButton} onPress={() => props.readresultdoctor(item)}>
              <Text style={styles.readTXt}>{getString("read_result_doctor") || ('Read result with doctor')}</Text>
            </TouchableOpacity>
            : null}

        </View>
      </View >

    )
  }
  const pendingCardview = (item: any) => {
    return (

      <View style={{ marginTop: 10 }}>
        {item.insurance_details ?
          <View style={styles.serviceView}>
            {item.insurance_details.icon_name && item.insurance_details.icon_name.length > 1 ?
              <View style={styles.iconContainer}>

                <IKON
                  name={item.insurance_details.icon_name}
                  height={20}
                  width={20}
                />
              </View> :
              item.insurance_details.icon && item.insurance_details.icon.length > 1 ?
                <Image
                  source={{ uri: item.title_icons }}
                  style={styles.newIamgeIcon}
                  resizeMode="contain"
                /> : null}
            <View style={{ flexDirection: 'row', flex: 1, }}>
              {item.insurance_details.key ? <Text style={styles.patientNameTxt}>{item.insurance_details.key}</Text> : null}
              {item.insurance_details.value ? <Text style={styles.patientName}>{item.insurance_details.value}</Text> : null}

            </View>
          </View> : null}
        {renderInsButton(item, onBookFromPending)}
      </View>
    )
  }

  const renderAppointmentListItem = ({ item, index }) => {
    var img = item.img && item.img.length > 0 ? { uri: item.img } : DefaultUserImg
    return (
      <><View style={styles.appointmentcard}>
        <View style={{ flexDirection: 'row',}}>
          <Image
            source={img}
            style={styles.doctorImage}
            resizeMode="contain" />

          <View style={{ marginHorizontal: 15, flex: 1, backgroundColor: theme.colors.white }}>
            <View style={styles.doctorTitle}>
              <Text style={styles.doctorTxt}>{item.name}</Text>
              <View style={[I18nManager.isRTL && { transform: [{ rotateY: '180deg' }] }, styles.image]}>
                <IKON
                  name={item.icon_name}
                  height={18}
                  width={18} />
                <Text style={styles.prodTxt}>{item.prod_name}</Text>
              </View>

            </View>
            {item.subType ? <Text style={styles.donationTxt}>{item.subType}</Text> : null}

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                {item && item.apnt_info?.map((item:any) => {
                  return (
                    <View style={{ marginTop: 5 }}>
                      <Text style={[styles.patientTxt, { color: item.colour }]}>{item.value}</Text>
                    </View>
                  )
                })}
              </View>

              <TouchableOpacity style={[I18nManager.isRTL && { transform: [{ rotateY: '180deg' }] }]} onPress={() => onAppointmentPress(item)}>
                <IKON
                  name="RightPointingBlueArrow"
                  height={20}
                  width={20} />
              </TouchableOpacity>
            </View>

            {item.status == 0 ? upcomingCardview(item) : null}
            {item.status == 1 ? completedCardview(item) : null}
            {item.status == 3 ? pendingCardview(item) : null}
          </View>


        </View>
      </View><View style={styles.separator} /></>
    )
  }


  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 150 }}
      showsVerticalScrollIndicator={false}
      data={list}
      renderItem={renderAppointmentListItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={loader ? null : emptyComponent()}
      onEndReachedThreshold={0.2}
      onMomentumScrollBegin={() => {
        setonEndReached(false);
      }}
      ListFooterComponent={() => bottomView()}
    onEndReached={() => {
      if (!onEndReached) {
        props.apiCall();
        setonEndReached(true)
       
      }
    }}
    />
  );
}

export default AppointmentListCardV3

const styles = StyleSheet.create({
  appointmentcard: {
    backgroundColor: theme.colors.white,
    marginHorizontal: 10,
    // borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginVertical: 5,
    borderColor: theme.colors.ash,
    // borderWidth: 0.5
  },
  separator: {
    borderWidth: 0.2,
    borderColor: '#e4e4e4',
    backgroundColor: "white",
    marginHorizontal: 20,
    marginEnd: -20
  },
  doctorImage: {
    height: 45,
    width: 50,
  },
  doctorTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    flex: 1,
  },
  doctorTxt: {
    color: theme.colors.black,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fonts.font11_5,
    textAlign: 'left',
    flex: 1
  },
  patientName: {
    color: theme.colors.black,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fonts.font10_5,
    flex: 1,
    textAlign: 'left'

  },
  joinTxt: {

    color: theme.colors.white,
    fontFamily: theme.fontFamily.semiBold,
    fontSize: theme.fonts.font11,
  },
  buttonView: {
    textAlign: 'left',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    marginHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
    padding: 4,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  viewButton: {
    textAlign: 'left',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    marginHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
    padding: 4,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center'
  },
  resultButton: {
    textAlign: 'left',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    marginHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
    padding: 4,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  doctorButton: {
    textAlign: 'left',
    backgroundColor: theme.colors.primary,
    marginHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
    padding: 4,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center'
  },
  tatView: {
    textAlign: 'left',
    backgroundColor: theme.colors.grey,
    marginHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
    padding: 4,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  waitingView: {
    textAlign: 'left',
    backgroundColor: theme.colors.grey,
    marginHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
    padding: 4,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'center',
  },
  time: {
    textAlign: 'left',
    fontSize: theme.fonts.font10_5,
    fontFamily: theme.fontFamily.regular,
    marginLeft: 5
  },
  joinNowBtn: {
    backgroundColor: theme.colors.blue,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    paddingVertical: 5,
    marginTop: 10
  },
  prescriptionTXt: {
    color: theme.colors.blue,
    alignItems: "center",
    fontFamily: theme.fontFamily.semiBold,
    fontSize: theme.fonts.font10,
    textAlign: 'left'
  },
  tattxt: {
    color: theme.colors.greyText,
    alignItems: "center",
    fontFamily: theme.fontFamily.semiBold,
    fontSize: theme.fonts.font10,
    textAlign: 'left'
  },
  timetxt:{
    color: theme.colors.black,
    alignItems: "center",
    fontFamily: theme.fontFamily.semiBold,
    fontSize: theme.fonts.font10,
    textAlign: 'left'
  },
  waitingtxt: {
    color: theme.colors.greyText,
    alignItems: "center",
    fontFamily: theme.fontFamily.semiBold,
    fontSize: theme.fonts.font10,
    textAlign: 'left'
  },
  timetxt:{
    color: theme.colors.black,
    alignItems: "center",
    fontFamily: theme.fontFamily.semiBold,
    fontSize: theme.fonts.font10,
    textAlign: 'left'
  },
  readTXt: {
    color: theme.colors.white,
    alignItems: "center",
    fontFamily: theme.fontFamily.semiBold,
    fontSize: theme.fonts.font11,
    textAlign: 'left'
  },
  readView: {
    textAlign: 'left',
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    marginHorizontal: 5,
    marginTop: 15,
    marginBottom: 5,
    padding: 3,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  reschedule: { backgroundColor: theme.colors.blue, borderRadius: 5 },
  emptyList_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120
  },
  image: {
    flexDirection: 'row',
    alignItems:'center'
  },
  prodTxt: {
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fonts.font11,
    textAlign: 'left',
    marginLeft: 5
  },
  donationTxt: {
    fontSize: theme.fonts.font12,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.darkGreen,
    textAlign: 'left',

},
  patientTxt: {
    // color: theme.colors.greyText,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fonts.font11,
    textAlign: 'left'
  },
  appidTxt: {
    color: theme.colors.greyText,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fonts.font11,
    marginTop: 10,
    textAlign: 'left'
  },
  datetxt: {
    color: theme.colors.black,
    fontFamily: theme.fontFamily.medium,
    fontSize: theme.fonts.font11,
    marginTop: 10,
    textAlign: 'left'
  },
  rescheduleTxt: {
    color: theme.colors.white,
    fontSize: theme.fonts.font10_5,
    marginHorizontal: 5,
    paddingHorizontal: 3,
    fontFamily: theme.fontFamily.medium,
    paddingVertical: 3
  },
  serviceView: {
    flexDirection: 'row',
    marginBottom: 10,
    // alignItems: 'center'
    // marginTop: 5,
  },
  iconContainer: {
    height: 20,
    width: 20,
    marginRight: 10
  },
  newIamgeIcon: {
    height: 20,
    width: 20,
  },
  patientNameTxt:
  {
    color: theme.colors.baseGrey,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fonts.font10_5,
    marginRight: 8,
    textAlign: 'left'
  },



})