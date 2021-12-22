import { FormEvent, useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import {Button} from '../components/Button';
import {RoomCode} from '../components/RoomCode';

//import {useAuth} from '../hooks/useAuth';
import { database } from '../services/firebase';
import {ref, update, remove} from 'firebase/database';

import '../styles/room.scss';

import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { useNavigate } from 'react-router-dom';



export function AdminRoom(){
    //const {user} = useAuth();
    const navigate = useNavigate();
    const {id} : any = useParams();
    const {title, questions} = useRoom(id)

    async function handleEndRoom(){
        if(window.confirm("Tem certeza que deseja exlcuir esta sala?")){
            const roomRef = ref(database, `rooms/${id}`);
            await update(roomRef, {
                endedAt: new Date(),
            });
        }

        navigate('/');
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm("Tem certeza que deseja exlcuir esta pergunta?")){
            const questionRef = ref(database, `rooms/${id}/questions/${questionId}`);
            await remove(questionRef);
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string){
        const questionRef = ref(database, `rooms/${id}/questions/${questionId}`);
        await update(questionRef, {
            isAnswered: true
        })
    }

    async function handleHighlightQuestion(questionId: string){
        const questionRef = ref(database, `rooms/${id}/questions/${questionId}`);
        await update(questionRef, {
            isHighlighted: true
        })
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={id} />
                        <Button 
                            isOutlined
                            onClick={handleEndRoom}
                        >
                            Encerrar sala
                        </Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title} </h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s) </span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return(
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                               {!question.isAnswered && (
                                   <>
                                        <button
                                        type="button"
                                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida"/>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque à pergunta"/>
                                        </button>
                                    </>
                               )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta"/>
                                </button>
                            </Question>
                        );
                    })}
                </div>

            </main>
        </div>
    );
}