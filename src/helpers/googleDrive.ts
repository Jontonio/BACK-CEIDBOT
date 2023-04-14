import { google } from 'googleapis';
import * as fs from "fs";

const SCOPES = [
    'https://www.googleapis.com/auth/drive',
];
const parentFolderId = '1Qub4HU4zJHFm3OeynEwdGjVZigerGLKz';

const auth = new google.auth.GoogleAuth({
    keyFile: 'src/config/ceid-storage-unajma.json',
    scopes: SCOPES,
  });

  const drive = google.drive({
    version: 'v3',
    auth
  });


export const uploadFileDrive = async (file:any, codeGrupo:string, folderDestion:string) => {

    let yearFolderID:string;
    let grupoFolderID:string;
    let matriculaFolderID:string;
    let mensualidadFolderID:string;

    const fileName = `archivo-${Date.now()}`;
    const year = new Date().getFullYear();
    
    //TODO: verifify if exists folder year
    const folderYearExists = await checkIfFolderYearExists(String(year), parentFolderId);

    if(!folderYearExists){
      const folderYear = await createFolder(String(year), parentFolderId);
      yearFolderID = folderYear.data.id;
    }else{
      yearFolderID = folderYearExists.id;
    }

    const folderGrupoExists = await checkIfFolderYearExists(`Grupo-${codeGrupo}`, yearFolderID);
    if(!folderGrupoExists){
      const folderGrupo = await createFolder(`Grupo-${codeGrupo}`, yearFolderID);
      grupoFolderID = folderGrupo.data.id;
    }else{
      grupoFolderID = folderGrupoExists.id;
    }

    const folderMatriculaExists = await checkIfFolderYearExists('matricula', grupoFolderID);
    
    if(!folderMatriculaExists){
      const folderMatricula = await createFolder('matricula', grupoFolderID);
      matriculaFolderID = folderMatricula.data.id;
    }else{
      matriculaFolderID = folderMatriculaExists.id;
    }

    const folderMensualidadExists = await checkIfFolderYearExists('mensualidad', grupoFolderID);

    if(!folderMensualidadExists){
      const folderMensualidad = await createFolder('mensualidad', grupoFolderID);
      mensualidadFolderID = folderMensualidad.data.id;
    }else{
      mensualidadFolderID = folderMensualidadExists.id;
    }

    const folderIDDireccion = folderDestion=='matricula'?matriculaFolderID:mensualidadFolderID;

    const res = await drive.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: fileName,
        mimeType: file.mimetype,
        parents:[folderIDDireccion]
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path)
      },
      fields:'id'
    });

    const fileId:string | undefined | null = res.data.id;

    const result = getLinkFile(fileId);
      
    return result;
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

const checkIfFolderYearExists = async (folderName:string, idFolder:string) => {
  try {
    const response = await drive.files.list({
      q: `'${idFolder}' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
    });

    const folders = response.data.files;

    const existingFolder = folders.find(folder => folder.name === folderName);

    return existingFolder;

  } catch (e) {
    console.error(`Error al verificar si existe el folder: ${e}`);
    return false;
  }
}
