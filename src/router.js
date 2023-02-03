import React, {lazy, Suspense} from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Guard from "./guard"
import PublicLayout from "./components/publicLayout"
import PrivateLayout from "./components/privateLayout"
import FullscreenSpin from "./components/helpers/fullscreen-spin";
// import Restricted from "./restricted";
// import AccessDenied from "./components/AccessDenied";

// import Restricted from "./restricted";
// import AccessDenied from "./components/AccessDenied";
// import Genre from "./routes/admin/genre";

// PUBLIC
const Login = lazy(() => import('./components/auth/signin'))
const InvitationAccept = lazy(() => import('./components/auth/invitationAccept'))

// PRIVATE
// Movie
const Main = lazy(() => import('./components/home/main'))
const Profile = lazy(() => import('./components/profile/profile'))
const ProfileDetails = lazy(() => import('./components/profile/profileDetails'))
const Invite = lazy(() => import('./components/profile/invite'))
const MovieDetail = lazy(() => import('./components/movie/movieDetail'))

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/login",
            element: <PublicLayout/>,
            children: [
                {
                    index: true,
                    element: <Suspense fallback={<FullscreenSpin/>}><Login/></Suspense>
                }
            ],
        },
        {
            path: "/invitation/accept/:token",
            element: <PublicLayout/>,
            children: [
                {
                    index: true,
                    element: <Suspense fallback={<FullscreenSpin/>}><InvitationAccept/></Suspense>
                }
            ],
        },
        {
            path: "/",
            element: <Guard><PrivateLayout/></Guard>,
            children: [
                {
                    index: true,
                    element: <Suspense fallback={<FullscreenSpin/>}><Main/></Suspense>
                },
                {
                    path: 'movie/:id',
                    element: <Suspense fallback={<FullscreenSpin/>}><MovieDetail/></Suspense>
                },
                {
                    path: 'profile',
                    element: <Suspense fallback={<FullscreenSpin/>}><Profile/></Suspense>,
                    children: [
                        {
                            index: true,
                            element: <Suspense fallback={<FullscreenSpin/>}><ProfileDetails/></Suspense>
                        },
                        {
                            path: 'invites',
                            element: <Suspense fallback={<FullscreenSpin/>}><Invite/></Suspense>
                        }
                    ],
                }
            ],
        },
        // {
        //     path: "/admin",
        //     element: <Guard><AdminLayout/></Guard>,
        //     children: [
        //         {
        //             path: 'movie/create',
        //             element: <Suspense fallback={<FullscreenSpin/>}>
        //                 <Restricted to='ROLE_ADMIN' fallback={<AccessDenied />}><MovieCreate/></Restricted>
        //             </Suspense>
        //         },
        //         {
        //             path: 'movie/edit/:id',
        //             element: <Suspense fallback={<FullscreenSpin/>}>
        //                 <Restricted to='ROLE_ADMIN' fallback={<AccessDenied />}><MovieCreate/></Restricted>
        //             </Suspense>
        //         },
        //         {
        //             path: 'movies',
        //             element: <Suspense fallback={<FullscreenSpin/>}>
        //                 <Restricted to='ROLE_ADMIN' fallback={<AccessDenied />}><MovieAdminList/></Restricted>
        //             </Suspense>
        //         },
        //         {
        //             path: 'genres',
        //             element: <Suspense fallback={<FullscreenSpin/>}>
        //                 <Restricted to='ROLE_ADMIN' fallback={<AccessDenied />}><Genre/></Restricted>
        //             </Suspense>
        //         }
        //     ],
        // },
    ])

    return  <RouterProvider router={router} />
}

export default Router;