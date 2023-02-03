import React, {useEffect, useState} from "react";
import {requestWithToken} from "../../config/axios-config";

import Spin from "../helpers/spin";
import SpinUntilLoad from "../helpers/spinUntilLoad";
import moment from "moment/moment";

const Invite = () => {

    moment.locale('az')

    const [isLoading, setIsLoading] = useState(false)
    const [actionsState, setActionsState] = useState([])
    const [invites, setInvites] = useState([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isInvitationSending, setIsInvitationSending] = useState(false);
    const [email, setEmail] = useState('');
    const [inviteListTriggerCount, setInviteListTriggerCount] = useState(0);
    const [isPersonInfoIsLoading, setIsPersonInfoIsLoading] = useState(false);
    const [personInfo, setPersonInfo] = useState(null);
    const [inviteErrorText, setInviteErrorText] = useState(null);

    const isValidEmail = (email) => {
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return regex.test(email);
    }

    useEffect(() => {
        setIsLoading(true);
        requestWithToken()
            .get('/invite')
            .then(function (response) {
                setInvites(response.data.data)
                setIsLoading(false)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [inviteListTriggerCount])

    const cancelInvite = (id) => {

        if (!window.confirm("Are sure to Cancel?"))
        {
            return;
        }

        setActionsState([...actionsState, id]);

        requestWithToken()
            .put('/invite/cancel/' + id)
            .then(function (response) {

                const newInvites = invites.map(invite => {
                    if (invite.id === id) {
                        return {...invite, status: 2};
                    }
                    return invite;
                });

                const actions = actionsState.filter(action => {
                    return action !== id;
                })

                setActionsState(actions);
                setInvites(newInvites);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const toggleInviteModal = () => {
        setIsPersonInfoIsLoading(true);

        if(!isInviteModalOpen) {
            requestWithToken()
                .get('/person/info')
                .then(function (response) {
                    setPersonInfo(response.data.data);
                    setIsPersonInfoIsLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        setIsInviteModalOpen(!isInviteModalOpen)
    }

    const daysRemaining = (expireDate) => {
        return moment(expireDate).fromNow()
        // const today = moment();
        //
        // console.log(expireAt, today, expireAt.diff(today, 'days'))
        //
        // return expireAt.diff(today, 'days');
    }

    const emailInputHandle = e => {
        setEmail(e.currentTarget.value);
    }

    const sentInvitation = (e) => {
        e.preventDefault();
        setInviteErrorText('');
        if(!isValidEmail(email)) {
            setInviteErrorText('Please type correct email address');
            return;
        }

        setIsInvitationSending(true);

        requestWithToken()
            .post('/invite', {email: email})
            .then(function (response) {
                setIsInvitationSending(false);
                setInviteListTriggerCount(inviteListTriggerCount + 1);
                setEmail('');
                setIsInviteModalOpen(false);
            })
            .catch(function (error) {
                console.log(error.response.data.type)
                if(error.response.status === 409) {
                    if(error.response.data.type === 'has_active_invite') {
                        console.log('Someone is already sent the invitation to this email')
                        setInviteErrorText('Someone is already sent the invitation to this email');
                        setIsInvitationSending(false);
                    }

                    return;
                }
                setInviteErrorText(error?.response?.data?.errors?.email)
                setIsInvitationSending(false);
                console.log(error);
            });
    }

    return (

        <div className="row">
            { isInviteModalOpen &&
                <div className="col-12">
                    <form action="#" className="subscribe">
                        <div className="subscribe__img">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path
                                    d="M13.64,9.74l-.29,1.73A1.55,1.55,0,0,0,14,13a1.46,1.46,0,0,0,1.58.09L17,12.28l1.44.79A1.46,1.46,0,0,0,20,13a1.55,1.55,0,0,0,.63-1.51l-.29-1.73,1.2-1.22a1.54,1.54,0,0,0-.85-2.6l-1.62-.24-.73-1.55a1.5,1.5,0,0,0-2.72,0l-.73,1.55-1.62.24a1.54,1.54,0,0,0-.85,2.6Zm1.83-2.13a1.51,1.51,0,0,0,1.14-.85L17,5.93l.39.83a1.55,1.55,0,0,0,1.14.86l1,.14-.73.74a1.57,1.57,0,0,0-.42,1.34l.16,1-.79-.43a1.48,1.48,0,0,0-1.44,0l-.79.43.16-1a1.54,1.54,0,0,0-.42-1.33l-.73-.75ZM21,15.26a1,1,0,0,0-1,1v3a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V9.67l5.88,5.88a2.94,2.94,0,0,0,2.1.88l.27,0a1,1,0,0,0,.91-1.08,1,1,0,0,0-1.09-.91.94.94,0,0,1-.77-.28L5.41,8.26H9a1,1,0,0,0,0-2H5a3,3,0,0,0-3,3v10a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3v-3A1,1,0,0,0,21,15.26Z"></path>
                            </svg>
                        </div>
                        <h4 className="subscribe__title">New Invitation</h4>
                        {!isPersonInfoIsLoading ?
                            <>
                                <p className="subscribe__text">You have {personInfo.invitation_count == -1 ? 'infinite' : personInfo.invitation_count} invitation left</p>
                                {
                                    personInfo.invitation_count !== 0 && <>
                                        <div className="sign__group">
                                            <input disabled={isInvitationSending} onChange={emailInputHandle} value={email} type="text" className="sign__input" placeholder="Email"/>
                                            <p style={{color: '#e55d5d', fontSize: '14px', padding: '10px 20px'}}>{inviteErrorText}</p>
                                        </div>
                                        {isInvitationSending ? <Spin /> : <button disabled={isInvitationSending} onClick={sentInvitation} type="button" className="sign__btn">Send Invitation</button>}
                                    </>
                                }
                            </>
                            : <Spin />
                        }
                        <button onClick={toggleInviteModal} type="button" className="close-invite-modal">Close</button>
                    </form>
                </div>
            }
            <div className="col-12">
                <div className="sign__wrap">
                    <div className="row">
                        <div className="col-12 col-xl-12">
                            <div className="dashbox">
                                <div className="dashbox__title" style={{alignItems: 'center'}}>
                                    <h3>Invited Friends</h3>
                                    { !isInviteModalOpen && <button onClick={toggleInviteModal} style={{width: '180px', height: '35px', margin: 0}} type="button" className="sign__btn">New invitation</button> }
                                </div>

                                <div className="dashbox__table-wrap dashbox__table-wrap--1">
                                    <>
                                        {
                                            isLoading ? <Spin/> :
                                            <table className="main__table main__table--dash">
                                                <thead>
                                                <tr>
                                                    <th>N</th>
                                                    <th>Email</th>
                                                    <th>Status</th>
                                                    <th>Invitation Date</th>
                                                    <th>Expire</th>
                                                    <th>Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    invites.map(invite => {
                                                        return (
                                                            <tr key={invite.id}>
                                                                <td>
                                                                    <div className="main__table-text">#{invite.id}</div>
                                                                </td>
                                                                <td>
                                                                    <div className="main__table-text"><a href="#">{invite.email}</a></div>
                                                                </td>
                                                                <td>
                                                                    <div className="main__table-text">
                                                                        {
                                                                            invite.status === 0 ? 'Pending' : invite.status === 1 ? 'Accepted' : 'Cancelled'
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="main__table-text">
                                                                        {moment(invite.createdAt).format('DD.MM.YYYY, LT')}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="main__table-text">
                                                                        {invite.status === 0 ? daysRemaining(invite.expireAt) : '-'}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <SpinUntilLoad isLoading={actionsState.includes(invite.id)}>
                                                                        <div className="main__table-text main__table-text--rate">
                                                                            {invite.status === 0 && <div className="main__table-text"><a onClick={() => cancelInvite(invite.id)} href="#">Cancel</a></div>}
                                                                        </div>
                                                                    </SpinUntilLoad>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }

                                                </tbody>
                                            </table>
                                        }
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Invite;