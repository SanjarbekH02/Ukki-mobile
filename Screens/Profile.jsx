import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={require('../assets/images/user.png')} // o'zingizning avatar rasmingiz
                    style={styles.avatar}
                />
                <Text style={styles.name}>Eshonov Fakhriyor</Text>
                <Text style={styles.phone}>+998 97 628 28 82</Text>
            </View>

            <View style={styles.menuContainer}>
                <MenuItem icon="person-outline" label="Profil ma'lumotlari" />
                <MenuItem icon="heart-outline" label="Saqlangan kurslar" />
                <MenuItem icon="star-outline" label="Ilovamizni baholang" />
                <MenuItem icon="chatbubble-ellipses-outline" label="Savol yoki takliflar uchun" />
                <MenuItem icon="globe-outline" label="Til" rightText="O'zbekcha" />
                <MenuItem icon="log-out-outline" label="Tizimdan chiqish" />
            </View>
        </View>
    );
};

const MenuItem = ({ icon, label, rightText }) => (
    <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuLeft}>
            <Icon name={icon} size={24}  color="#595E62" style={styles.menuIcon} />
            <Text style={styles.menuText}>{label}</Text>
        </View>
        {rightText && <Text style={styles.rightText}>{rightText}</Text>}
        <Icon name="chevron-forward" size={20} color="#93989B" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEFFFC'
    },
    profileContainer: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingTop: 60,
        backgroundColor: "#EEFFFC",
        // marginBottom: 20,

    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ddd',
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 10,
        color: '#000',
    },
    phone: {
        fontSize: 14,
        fontWeight: "400",
        color: '#000',
        marginTop: 4,
    },
    menuContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        // marginHorizontal: 20,
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
        
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        marginRight: 12,
    },
    menuText: {
        fontSize: 16,
        color: '#000',
        fontWeight: "500"
    },
    rightText: {
        fontSize: 16,
        color: '#6B7073',
        marginLeft: "auto",
        marginRight: 10
    },
});

export default ProfileScreen;
