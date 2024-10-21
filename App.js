import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import { NavigationContainer } from '@react-navigation/native';  // Import điều hướng
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Màn hình chính HomeScreen
function HomeScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');

    // Lấy số điện thoại từ AsyncStorage khi màn hình HomeScreen được mở
    useEffect(() => {
        const fetchPhoneNumber = async () => {
            try {
                const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
                if (storedPhoneNumber !== null) {
                    setPhoneNumber(storedPhoneNumber);
                }
            } catch (error) {
                console.log('Lỗi khi lấy số điện thoại từ AsyncStorage:', error);
            }
        };

        fetchPhoneNumber();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>HELLO</Text>
            <Text style={styles.phoneText}>Số điện thoại đăng nhập: {phoneNumber}</Text>
        </View>
    );
}

// Màn hình đăng nhập
function LoginScreen({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(true);

    const handlePhoneNumberChange = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        let formattedNumber = numericValue;
        if (numericValue.length > 3 && numericValue.length <= 6) {
            formattedNumber = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
        } else if (numericValue.length > 6) {
            formattedNumber = `${numericValue.slice(0, 3)}-${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
        }
        setPhoneNumber(formattedNumber);
        setErrorMessage('');
    };

    const handleContinuePress = async () => {
        const plainNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (plainNumber.length !== 10) {
            setErrorMessage('Số điện thoại không hợp lệ. Vui lòng nhập 10 số.');
        } else {
            try {
                // Lưu số điện thoại vào AsyncStorage
                await AsyncStorage.setItem('phoneNumber', plainNumber);
                // Điều hướng tới HomeScreen
                navigation.navigate('Home');
            } catch (error) {
                console.log('Lỗi khi lưu số điện thoại vào AsyncStorage:', error);
            }
        }
    };

    useEffect(() => {
        setIsModalVisible(true);
    }, []);

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={closeModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Welcome</Text>
                        <Text style={styles.modalMessage}>Chào mừng đến với khoá học lập trình React Native tại CodeFresher.vn</Text>
                        <TouchableOpacity style={styles.okButton} onPress={closeModal}>
                            <Text style={styles.okButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.headerContainer}>
                <Text style={styles.header}>Đăng nhập</Text>
            </View>

            <View style={styles.innerContainer}>
                <Text style={styles.subHeader}>Nhập số điện thoại</Text>
                <Text style={styles.description}>
                    Dùng số điện thoại để đăng nhập hoặc đăng ký tài khoản tại OneHousing Pro
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nhập số điện thoại của bạn"
                    keyboardType="numeric"
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    maxLength={12}
                />

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleContinuePress}>
                    <Text style={styles.buttonText}>Tiếp tục</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // Canh giữa theo chiều dọc
    alignItems: 'center',      // Canh giữa theo chiều ngang
    backgroundColor: '#fff',
},
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    okButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    okButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    headerContainer: {
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,  // Thêm khoảng cách giữa tiêu đề và số điện thoại
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#eee',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#000',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    phoneText: {
      fontSize: 20,
      color: '#007bff',  // Đổi màu số điện thoại thành xanh (hex: #007bff)
   }
});
