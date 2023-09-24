// Import database as "db" from firebase/config
import { db } from '../../firebase/config'

// Import the functions, we need some methods from firestore
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'

const bringUnits = async () => {

    const unitsRef = collection(db, 'units')

    const docSnap = await getDocs(unitsRef)

    let unitArray = [];

    docSnap.forEach(doc => {
        unitArray.push({ ...doc.data(), id: doc.id })
    })

    return unitArray;

}

const bringSelectedUnit = async (id) => {

    const docRef = doc(db, 'units', id);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id }
    } else {
        return null
    }

}

const unitService = {
    bringUnits,
    bringSelectedUnit
}

export default unitService;
