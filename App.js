import React, {useState, useRef} from 'react'
import {SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Platform, ScrollView, Alert, Image} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'

const Tab = createBottomTabNavigator()

function HomeScreen({navigation}){
  // small demo stats (would normally come from an API)
  const [stats] = useState({applications: 1, documents: 2, stepsLeft: 1})

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>College Admission Portal</Text>
      <Text style={s.p}>Welcome! Use the quick actions below to continue your application.</Text>

      <View style={s.row}>
        <View style={s.card}>
          <Text style={s.stat}>{stats.applications}</Text>
          <Text style={s.cardLabel}>Applications</Text>
        </View>
        <View style={s.card}>
          <Text style={s.stat}>{stats.documents}</Text>
          <Text style={s.cardLabel}>Documents</Text>
        </View>
        <View style={s.card}>
          <Text style={s.stat}>{stats.stepsLeft}</Text>
          <Text style={s.cardLabel}>Steps left</Text>
        </View>
      </View>

      <View style={{padding:20}}>
        <TouchableOpacity style={s.btn} onPress={()=> navigation.navigate('Form')}>
          <Text style={s.btnText}>Fill Application</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.btn, {backgroundColor:'#6c757d', marginTop:10}]} onPress={()=> navigation.navigate('Uploads')}>
          <Text style={s.btnText}>View Uploads</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.btn, {backgroundColor:'#28a745', marginTop:10}]} onPress={()=> navigation.navigate('Profile')}>
          <Text style={s.btnText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function FormScreen({navigation}){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState('')
  const [dob,setDob] = useState('')
  const [course,setCourse] = useState('')
  const [files,setFiles] = useState([])

  const pickDoc = async ()=>{
    try{
      const res = await DocumentPicker.getDocumentAsync({copyToCacheDirectory:true})
      if(res.type==='success') setFiles(prev=>[...prev, {name:res.name, uri:res.uri, type:'doc'}])
    }catch(e){console.log(e)}
  }

  const pickImage = async ()=>{
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if(status !== 'granted'){ Alert.alert('Permission required','Please grant photo permissions') ; return }
    const res = await ImagePicker.launchImageLibraryAsync({quality:0.6, allowsEditing:true})
    if(!res.cancelled) setFiles(prev=>[...prev, {name:'photo', uri:res.uri, type:'img'}])
  }

  const validate = ()=>{
    if(!name.trim()) return 'Enter name'
    if(!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return 'Enter valid email'
    if(phone && !phone.match(/^\d{7,15}$/)) return 'Enter valid phone'
    if(!course.trim()) return 'Select course'
    return null
  }

  const submit = ()=>{
    const err = validate()
    if(err) return Alert.alert('Validation', err)
    const payload = {name,email,phone,dob,course,files}
    console.log('submit',payload)
    Alert.alert('Success','Application submitted')
    setName(''); setEmail(''); setPhone(''); setDob(''); setCourse(''); setFiles([])
    navigation.navigate('Uploads')
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={{padding:20}}>
        <Text style={s.label}>Full name</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} placeholder="John Doe" />

        <Text style={s.label}>Email</Text>
        <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="you@mail.com" keyboardType="email-address" />

        <Text style={s.label}>Phone</Text>
        <TextInput style={s.input} value={phone} onChangeText={setPhone} placeholder="Optional" keyboardType="phone-pad" />

        <Text style={s.label}>Date of birth</Text>
        <TextInput style={s.input} value={dob} onChangeText={setDob} placeholder="YYYY-MM-DD" />

        <Text style={s.label}>Course</Text>
        <TextInput style={s.input} value={course} onChangeText={setCourse} placeholder="e.g. BSc Computer Science" />

        <Text style={[s.label,{marginTop:12}]}>Documents & Photo</Text>
        <View style={{flexDirection:'row', gap:10}}>
          <TouchableOpacity style={s.btn} onPress={pickDoc}><Text style={s.btnText}>Pick document</Text></TouchableOpacity>
          <TouchableOpacity style={s.btn} onPress={pickImage}><Text style={s.btnText}>Pick photo</Text></TouchableOpacity>
        </View>

        <View style={{marginTop:12}}>
          {files.map((f,i)=> (
            <View key={i} style={s.fileRow}>
              {f.type==='img' && <Image source={{uri:f.uri}} style={{width:50,height:50,borderRadius:6}} />}
              <Text style={{flex:1, marginLeft:8}} numberOfLines={1}>{f.name}</Text>
              <TouchableOpacity onPress={()=> setFiles(prev=>prev.filter((_,idx)=>idx!==i))}><Text style={{color:'red'}}>Remove</Text></TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[s.btn, {marginTop:20}]} onPress={submit}><Text style={s.btnText}>Submit</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

function UploadsScreen(){
  const [list,setList] = useState([])

  const pickDoc = async ()=>{
    try{
      const res = await DocumentPicker.getDocumentAsync({copyToCacheDirectory:true})
      if(res.type==='success') setList(prev=>[...prev, {name:res.name, uri:res.uri, type:'doc'}])
    }catch(e){console.log(e)}
  }

  const pickImage = async ()=>{
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if(status !== 'granted'){ Alert.alert('Permission required','Please grant photo permissions') ; return }
    const res = await ImagePicker.launchImageLibraryAsync({quality:0.6, allowsEditing:true})
    if(!res.cancelled) setList(prev=>[...prev, {name:'photo', uri:res.uri, type:'img'}])
  }

  const remove = (i)=> setList(prev=> prev.filter((_,idx)=> idx!==i))

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>Uploads</Text>
      <Text style={s.p}>This screen shows files you add locally. Integrate with your backend to persist uploads.</Text>

      <View style={{padding:20}}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <TouchableOpacity style={s.btn} onPress={pickDoc}><Text style={s.btnText}>Add document</Text></TouchableOpacity>
          <TouchableOpacity style={[s.btn,{backgroundColor:'#28a745'}]} onPress={pickImage}><Text style={s.btnText}>Add photo</Text></TouchableOpacity>
        </View>

        <View style={{marginTop:16}}>
          {list.length===0 && <Text style={{color:'#666'}}>No files yet. Add a document or photo to see it here.</Text>}
          {list.map((f,i)=> (
            <View key={i} style={s.fileRow}>
              {f.type==='img' && <Image source={{uri:f.uri}} style={{width:56,height:56,borderRadius:8}} />}
              <Text style={{flex:1, marginLeft:10}} numberOfLines={1}>{f.name}</Text>
              <TouchableOpacity onPress={()=> remove(i)}><Text style={{color:'red'}}>Remove</Text></TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}

function ProfileScreen(){
  const user = {name:'John Doe', email:'john.doe@mail.com', college:'Example University'}

  const edit = ()=> Alert.alert('Edit','Profile editing is a demo in this app')
  const logout = ()=> Alert.alert('Logout','You are now logged out (demo)')

  return (
    <SafeAreaView style={s.container}>
      <View style={{alignItems:'center', padding:20}}>
        <Image source={{uri:'https://placehold.co/100x100'}} style={s.avatar} />
        <Text style={[s.title,{marginTop:12}]}>{user.name}</Text>
        <Text style={s.p}>{user.email}</Text>
        <Text style={[s.p,{color:'#666', marginTop:6}]}>{user.college}</Text>

        <TouchableOpacity style={[s.btn,{marginTop:16}]} onPress={edit}><Text style={s.btnText}>Edit Profile</Text></TouchableOpacity>
        <TouchableOpacity style={[s.btn,{backgroundColor:'#dc3545', marginTop:10}]} onPress={logout}><Text style={s.btnText}>Logout</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

function MyTabBar({state, descriptors, navigation}){
  const anim = useRef(new Animated.Value(0)).current
  Animated.timing(anim, {toValue:state.index, duration:250, useNativeDriver:true}).start()

  return (
    <View style={tabStyles.bar}>
      {state.routes.map((route, idx)=> {
        const focused = state.index===idx
        const onPress = ()=> navigation.navigate(route.name)
        const scale = new Animated.Value(focused?1.15:1)
        Animated.spring(scale, {toValue: focused?1.15:1, useNativeDriver:true}).start()
        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={tabStyles.tab}>
            <Animated.View style={{transform:[{scale}]}}>
              <Text style={{color: focused? '#2f6bff':'#444'}}>{route.name}</Text>
            </Animated.View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default function App(){
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={props=> <MyTabBar {...props} />} screenOptions={{headerShown:false}}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Form" component={FormScreen} />
        <Tab.Screen name="Uploads" component={UploadsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const s = StyleSheet.create({
  container:{flex:1, backgroundColor:'#fff'},
  title:{fontSize:22, fontWeight:'700', margin:20},
  p:{marginHorizontal:20, color:'#555'},
  label:{marginTop:8, marginBottom:6, color:'#333'},
  input:{borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:8},
  btn:{padding:12, backgroundColor:'#2f6bff', borderRadius:8, alignItems:'center', justifyContent:'center', marginTop:8},
  btnText:{color:'#fff', fontWeight:'600'},
  fileRow:{flexDirection:'row', alignItems:'center', padding:8, borderWidth:1, borderColor:'#eee', borderRadius:8, marginBottom:8}
  ,
  row:{flexDirection:'row', justifyContent:'space-around', paddingHorizontal:12},
  card:{flex:1, backgroundColor:'#f8f9fa', padding:14, borderRadius:8, alignItems:'center', margin:8},
  stat:{fontSize:20, fontWeight:'700'},
  cardLabel:{color:'#555', marginTop:6},
  avatar:{width:100, height:100, borderRadius:50}
})

const tabStyles = StyleSheet.create({
  bar:{flexDirection:'row', height:164, borderTopWidth:1, borderColor:'#eee', backgroundColor:'#fff', alignItems:'center', justifyContent:'space-around'},
  tab:{flex:1, alignItems:'center', justifyContent:'center'}
})
