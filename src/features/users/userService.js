// We need the "Authentication Reference" so we want to access "auth":
import { auth, db } from '../../firebase/config'

// To log in with Google => We need login methods: "signInWithPopup, GoogleAuthProvider"
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'

// Accessing the database section w/
import { addDoc, collection, getDocs, query, where, serverTimestamp, arrayUnion, updateDoc, doc } from 'firebase/firestore';

const datasSets = [
    {
        text: "08:00",
        value: 8,
        passive: false
    },
    {
        text: "09:00",
        value: 9,
        passive: false
    },
    {
        text: "10:00",
        value: 10,
        passive: false
    },
    {
        text: "11:00",
        value: 11,
        passive: false
    },
    {
        text: "12:00",
        value: 12,
        passive: false
    },
    {
        text: "13:00",
        value: 13,
        passive: false
    },
    {
        text: "14:00",
        value: 14,
        passive: false
    },
    {
        text: "15:00",
        value: 15,
        passive: false
    },
    {
        text: "16:00",
        value: 16,
        passive: false
    },
    {
        text: "17:00",
        value: 17,
        passive: false
    },
    {
        text: "18:00",
        value: 18,
        passive: false
    },
]

const googleLogin = async () => {

    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        localStorage.setItem("user", JSON.stringify(result.user));
        return result.user;
    } catch (error) {
        throw Error(error.message)
    }

}

// Kullanıcı Doldur = userFill
const userFill = () => {
    return JSON.parse(localStorage.getItem('user'))
}

const formatHours = async (data) => {

    const passiveDatesRef = collection(db, "dates")

    const today = new Date();
    const formattedDate = today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();
    console.log(formattedDate);

    let q = query(passiveDatesRef, where("date", "==", formattedDate))
    q = query(q, where("unit", "==", data))

    const snaps = await getDocs(q);

    let dataSets = datasSets;

    console.log(snaps.empty);

    if (!snaps.empty) {

        snaps.forEach(doc => {

            console.log(doc.data());

            doc.data().hours.map(hour => {
                dataSets = dataSets.filter(function (data) {
                    if (data.value !== hour.value) {
                        return data
                    }
                })

                dataSets.push(hour)
            })
        })

        dataSets.sort(function (a, b) { return a.value - b.value });

    }
    return dataSets;
}

const addPassiveDate = async (unit, date, value, text) => {

    const dateRef = collection(db, 'dates');

    const q = query(dateRef, where("unit", "==", unit), where("date", "==", date));

    const docSnap = await getDocs(q);

    const hour = {
        value,
        text,
        passive: true
    }

    if (docSnap.empty) {
        await addDoc(dateRef, {
            unit: unit,
            date: date,
            hours: arrayUnion(hour)
        })
    } else {
        docSnap.docs.forEach(async (document) => {
            const documentId = document.id

            const documentRef = doc(db, 'dates', documentId)

            await updateDoc(documentRef, {
                hours: arrayUnion(hour)
            })
        })
    }

}

const createAppointment = async (data) => {

    const colRef = collection(db, "appointments");

    try {
        await addDoc(colRef, {
            unitId: data.unitId,
            unitName: data.unitName,
            hourValue: data.hourValue,
            hourText: data.hourText,
            date: data.date,
            email: data.email,
            creationDate: serverTimestamp(),
            status: "Waiting...",
            statusColor: "secondary",
            message: ''
        })

        await addPassiveDate(data.unitId, data.date, data.hourValue, data.hourText)
        return `Your appointment has been created for date: ${data.date} and time: ${data.hourText} in ${data.unitName}.`

    } catch (error) {
        return `Something went wrong ${error.message}. Your appointment has not been added!`
    }

}

const logout = async () => {

    await signOut(auth);

    localStorage.removeItem('user')

    return null;

}

const bringAppointments = async (data) => {

    const colRef = collection(db, "appointments")

    const q = query(colRef, where("email", "==", data))

    const docSnap = await getDocs(q);

    let array = [];

    docSnap.docs.forEach(document => {
        const appointmentDocument = {
            id: document.id,
            unitName: document.data().unitName,
            status: document.data().status,
            hour: document.data().hourText,
            date: document.data().date,
            statusColor: document.data().statusColor,
            message: document.data().message
        }

        array.push(appointmentDocument);
    })

    return array;

} 

const userService = {
    googleLogin,
    userFill,
    formatHours,
    createAppointment,
    bringAppointments,
    logout
}

export default userService