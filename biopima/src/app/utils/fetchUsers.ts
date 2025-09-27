// const baseUrl = "/api/user";
// import { NewUserType } from "./types";
// import { useRouter } from "next/navigation";

// const router = useRouter();

// export async function fetchUsers() {
//     try {
//         const response = await fetch(baseUrl);
//         if (!response.ok) {
//             throw new Error("Something went wrong" + response.statusText);
//         }
//         const result = await response.json();
//         return result;
//     } catch (error) {
//         throw new Error('Failed to fetch users' + (error as Error).message)
//     }
// }

// export async function createUser(userData: NewUserType) {
//     try {
//         const response = await fetch(baseUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(userData),
//         });
//         if (!response.ok) {
//             const errorResult = await response.json();
//             throw new Error(errorResult.message || `Something went wrong: ${response.status} ${response.statusText}`);
//         }
//         const createdUser = await response.json();
//         localStorage.setItem("email", createdUser.email);

//         router.push("/verify-code");

//         return createdUser;
//     } catch (error) {
//         throw new Error('Failed to create user: ' + (error as Error).message);
//     }
// }

const baseUrl = "/api/user";
import { NewUserType } from "./types";

export async function fetchUsers() {
    try {
        const response = await fetch(baseUrl);
        if (!response.ok) {
            throw new Error("Something went wrong" + response.statusText);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Failed to fetch users' + (error as Error).message)
    }
}

export async function createUser(userData: NewUserType) {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorResult = await response.json();

            throw new Error(errorResult.message || `Something went wrong: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Failed to create user: ' + (error as Error).message);
    }
}


