import { Client,Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';
//     const user = await account.get();
//     if (user) {
//       await account.deleteSession('current');
//     }
export const config = {
    endpoint:"https://cloud.appwrite.io/v1",
    platform: 'com.rida.aora',
    projectId : '66fb7004002b999319b0',
    databaseId : '66fb72b100074c0e3d6b',
    userCollectionId: '66fb72e3003be589d1b4',
    videoCollectionId : '66fb73420038e7c913e1',
    storageId: '66fb7539002a8e0bcce1'
}
const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = config;
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId)
    .setPlatform(config.platform)
    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

// Register User
export const createUser = async (email, password, username ) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if (!newAccount) throw Error;
        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser;        
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const checkLoginStatus = async () => {
        const user = await account.get();
        if (user) return true;
        else return false;
}

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if (!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

//Get all the posts posted
export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}
//get the latest trending posts 
export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}
    
    