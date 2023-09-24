// Import authentication & database as "auth" & "db" from firebase/config
import { auth, db } from "../../firebase/config";

// For logins: "signInWithEmailAndPassword"
// For logout: "signOut"
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// To check and learn the user's authorization after logging in: (according to uid information) "where"
// For the "where", we need some operation as: collection, query, getDocs
// For the process of assigning a moderator to the unit: We use the "doc" method to access the document. To update: "updateDoc"
// We want to access the document of a single unit: getDoc (btw, we have the unit id)
import { collection, query, where, getDocs, doc, updateDoc, getDoc, orderBy, limit } from "firebase/firestore";

// We will bring in unit moderators. Service and Slice formation will be done.
// So, We need to know which moderator is effective in which unit.
// We need to know all the units. We have to use "bringUnits" from unitService!!!
import unitService from "../units/unitService";

const login = async (email, password) => {

    const userResponse = await signInWithEmailAndPassword(auth, email, password);

    let authority = "no"
    let authorityUnitId = "no"

    if (userResponse.user) {

        const adminRef = collection(db, 'administrators');

        const q = query(adminRef, where("uid", "==", userResponse.user.uid))

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            // access to information as authority & authorityUnitId under the document (i.e. in the database)
            authority = doc.data().authority;
            authorityUnitId = doc.data().authorityUnitId;
        })

    }

    // Whatever we want to specify in the "return" field must be equal to the information in the "database" (firestore)
    // authorityUnitId: (document id) it did not come because there was no firestore database
    return { uid: userResponse.user.uid, email: userResponse.user.email, authority, authorityUnitId }

}

const bringAdminInfos = async (uid) => {

    let authority = "no"
    let authorityUnitId = "no"
    let email = "";

    const adminRef = collection(db, 'administrators')

    const q = query(adminRef, where("uid", "==", uid))

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
        // access to information as authority & authorityUnitId & email under the document (i.e. in the database)
        authority = doc.data().authority;
        authorityUnitId = doc.data().authorityUnitId;
        email = doc.data().email
    })

    return { uid, email, authority, authorityUnitId }

}

const logout = async () => {

    signOut(auth);
    localStorage.removeItem('admin');

    return null;

}

const bringModerator = async () => {

    const adminRef = collection(db, 'administrators')

    const q = query(adminRef, where("authority", "==", "moderator"))

    const querySnap = await getDocs(q);

    let array = [];

    querySnap.forEach(doc => {
        array.push({ ...doc.data(), id: doc.id })
    })

    return array;

}

// did: document id || unid: unit id || uid: user id
const assignModeratorToUnit = async (did, unid) => {

    const docRef = doc(db, 'administrators', did);
    const unitRef = doc(db, 'units', unid);

    let unitName = "";
    let userEmail = "";

    try {
        await updateDoc(docRef, {
            authorityUnitId: unid
        })

        const docSnap = await getDoc(docRef);
        const unitSnap = await getDoc(unitRef);

        unitName = unitSnap.data().name;
        userEmail = docSnap.data().email;

        // return "The unit was assigned to the moderator"
        return `${unitName} was assigned to the moderator as ${userEmail}`

    } catch (error) {
        return error
    }

}

// This Side of Sign; We take the moderator of the entire unit to the front.
// Admin will be able to see them easily. Who matches with whom?
const bringUnitsModerator = async () => {

    const units = await unitService.bringUnits();
    const moderators = await bringModerator();

    let array = [];

    moderators.forEach(m => {
        units.forEach(u => {
            if(u.id === m.authorityUnitId) {
                array.push({email: m.email, unitName: u.name})
            }
        })
    })

    return array;

}

const bringLast10unitAppointment = async (unitId) => {

    try {
        const colRef = collection(db, "appointments")

        const q = query(colRef, where("unitId", "==", unitId), where("status", "==", "Waiting..."), orderBy("creationDate", "desc"), limit(10));

        const docSnap = await getDocs(q);

        let array = [];

        docSnap.docs.forEach(document => {
            const data = {
                documentId: document.id,
                email: document.data().email,
                hourText: document.data().hourText,
                date: document.data().date
            }

            array.push(data)
        })

        return array

    } catch (error) {
        throw Error(error.message)        
    }

}

const changeStatus = async (data) => {

    const documentRef = doc(db, "appointments", data.documentId);

    await updateDoc(documentRef, {
        status: data.status,
        statusColor: data.statusColor
    })

    return 'Status Changed!'

}

const adminService = {
    login,
    bringAdminInfos,
    logout,
    bringModerator,
    assignModeratorToUnit,
    bringUnitsModerator,
    bringLast10unitAppointment,
    changeStatus
}

export default adminService;