import {Link, useNavigate} from 'react-router-dom';
import {FormEvent} from 'react';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import '../styles/auth.scss';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import {useState} from 'react';

import {ref, push} from 'firebase/database';
import { database } from '../services/firebase';


export function NewRoom(){
    const {user} = useAuth();
    const navigate = useNavigate()

    const [newRoom, setNewRoom] = useState('');

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();
        console.log(newRoom)

        if (newRoom.trim() == ''){
            return;
        }

        const roomReference =  ref(database, 'rooms');

        const firebaseRoom = await push(roomReference, {
            title: newRoom,
            authorId: user?.id
        });

        navigate(`/rooms/${firebaseRoom.key}`);
    };

    return (
        <div id="page-auth">

            <aside>
                <img src={illustrationImg} alt="Perguntas e respostas"/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire suas dúvidas em tempo-real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask"/>
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text" name=""
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">Criar sala</Button>
                    </form>

                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}