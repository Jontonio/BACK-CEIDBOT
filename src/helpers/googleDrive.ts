import { google } from 'googleapis';
import * as fs from "fs";

const SCOPES = [ 'https://www.googleapis.com/auth/drive' ];

//Id folder development
// const parentFolderId = '1Qub4HU4zJHFm3OeynEwdGjVZigerGLKz';
// const pathJSON = 'src/config/ceid-storage-unajma.json';

//Id folder production
const parentFolderId = '1Ob8oliM4RM3wsH4PtEy9_38NMBiB_mMq';
const pathJSON = 'src/config/storage-ceid-v2.json'

const auth = new google.auth.GoogleAuth({
    keyFile: pathJSON,
    scopes: SCOPES,
  });

  const drive = google.drive({
    version: 'v3',
    auth,
    timeout: 60000 
  });

const createFile = async (fileName:string, file:any, folderIDDireccion:string) => {
  try {

    const res = await drive.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: fileName,
        mimeType: file.mimetype,
        parents:[folderIDDireccion]
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      },
      fields:'id'
    });
  
    const fileId:string | undefined | null = res.data.id;
  
    const result = await getLinkFile(fileId);
      
    return result;
  } catch (e) {
    console.log(e)
  }
}

const getLinkFile = async (fileId:string) => {

  await drive.permissions.create({
    fileId,
    requestBody: {
    role: 'reader',
    type: 'anyone',
    },
  });

  //obtain the webview and webcontent links
  const result = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink, webContentLink',
  });

  return result;
}

const createFolder = async (name:string, idFolder:string) => {

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents:[idFolder]
  };

  const folder = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id'
  });
  
  return folder;
}

const checkIfFolderExists = async (folderName:string, idFolder:string) => {
  try {
    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and trashed = false and name='${folderName}' and '${idFolder}' in parents`,
      // q: `'${idFolder}' in parents and mimeType='application/vnd.google-apps.folder'`,
      // fields: 'nextPageToken, files(id, name)',
      fields: 'files(id, name)',
      spaces: 'drive'
    });

    const folders = response.data.files;

    if(folders.length > 0){
      return folders[0];
    }
    // const existingFolder = folders.find(folder => folder.name === folderName);
    // return existingFolder;
    return null;

  } catch (e) {
    console.error(`Error al verificar si existe el folder: ${e}`);
  }
}

export const uploadFileDrive = async (file:any, codeGrupo:string, folderDestination:string) => {

  let yearFolderID:string;
  let grupoFolderID:string;
  let DireccionFolderID:string;

  const fileName = `archivo-${Date.now()}`;
  const year = new Date().getFullYear();
  
  //verifify if exists folder year
  const folderYearExists = await checkIfFolderExists(String(year), parentFolderId);

  if(!folderYearExists){
    const folderYear = await createFolder(String(year), parentFolderId);
    yearFolderID = folderYear.data.id;
    console.log(`Folder ${String(year)} creado`)
  }else{
    yearFolderID = folderYearExists.id;
    console.log(`Folder ${String(year)} existe`)
  }

  const folderGrupoExists = await checkIfFolderExists(`Grupo-${codeGrupo}`, yearFolderID);

  if(!folderGrupoExists){
    const folderGrupo = await createFolder(`Grupo-${codeGrupo}`, yearFolderID);
    grupoFolderID = folderGrupo.data.id;
    console.log(`Folder Grupo-${codeGrupo} creado`)
  }else{
    grupoFolderID = folderGrupoExists.id;
    console.log(`Folder Grupo-${codeGrupo} existe`)
  }

  const folderDireccionExists = await checkIfFolderExists(folderDestination, grupoFolderID);
  if(!folderDireccionExists){
    const folderDireccion = await createFolder(folderDestination, grupoFolderID);
    DireccionFolderID = folderDireccion.data.id;
    console.log(`Folder ${folderDestination} creado`)
    return createFile(fileName, file, DireccionFolderID);
  }else{
    DireccionFolderID = folderDireccionExists.id;
    console.log(`Folder ${folderDestination} existe`)
    return createFile(fileName, file, DireccionFolderID);
  }
  
}

export const uploadOthersFilesDrive = async (file:any, folderDestination:string) => {

  let yearFolderID:string;
  let DireccionFolderID:string;

  const fileName = `archivo-${Date.now()}`;
  const year = new Date().getFullYear();
  
  //verifify if exists folder year
  const folderYearExists = await checkIfFolderExists(String(year), parentFolderId);

  if(!folderYearExists){
    const folderYear = await createFolder(String(year), parentFolderId);
    yearFolderID = folderYear.data.id;
    console.log(`Folder ${String(year)} creado`)
  }else{
    yearFolderID = folderYearExists.id;
    console.log(`Folder ${String(year)} existe`)
  }

  const folderDireccionExists = await checkIfFolderExists(folderDestination, yearFolderID);
  if(!folderDireccionExists){
    const folderDireccion = await createFolder(folderDestination, yearFolderID);
    DireccionFolderID = folderDireccion.data.id;
    console.log(`Folder ${folderDestination} creado`)
    return createFile(fileName, file, DireccionFolderID);
  }else{
    DireccionFolderID = folderDireccionExists.id;
    console.log(`Folder ${folderDestination} existe`)
    return createFile(fileName, file, DireccionFolderID);
  }

}