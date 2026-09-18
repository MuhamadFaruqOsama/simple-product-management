// import { NextRequest, NextResponse } from "next/server";
// import { isAuthenticated } from "../authHelper";

// export async function GET(req: NextRequest) {
//     try {
//         const auth = await isAuthenticated(req)
//         if(!auth.status) {
//             return NextResponse.json({
//                 status: auth.status,
//                 status_code: 401,
//                 data: null,
//                 message: "Unauthorized"
//             })
//         }

//         const userId = auth.payload?.id
//         if (typeof userId !== "number") {
//             return NextResponse.json({
//                 status: false,
//                 status_code: 401,
//                 data: null,
//                 message: "unauthorized"
//             }, { status: 401 })
//         }

        
        
//     } catch (error) {
//         console.log(error);

//         return NextResponse.json({
//             status: false,
//             status_code: 500,
//             data: null,
//             message: "Terjadi kesalahan pada server. Coba lagi nanti",
//         }, { status: 500 });
//     }
// }