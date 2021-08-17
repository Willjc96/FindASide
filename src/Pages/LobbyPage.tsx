import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../Config/firebase';

interface DocumentData {
}

interface id {
    gameId: string;
    lobbyId: string;
}



export default function LobbyPage() {
    let id: id = useParams();
    const [peopleArray, setPeopleArray] = useState<[] | DocumentData[]>([])

    useEffect(() => {
        const getDbData = async () => {
            const db = await firestore.collection(id.gameId)
            db.doc(id.lobbyId).collection('Users').get().then((res) => {
                const dBPeopleArray = res.docs.map((doc) => {
                    const people = doc.data()
                    return people
                })
                setPeopleArray(dBPeopleArray)
            })
        }
        getDbData()

    }, [id.lobbyId, id.gameId])

    return (
        <div>
            {console.log(peopleArray)}
            <p>hi</p>
        </div>
    )
}
