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
  let matriculaFolderID:string;
  let requisitosFolderID:string;
  let mensualidadFolderID:string;
  let pagoLibroFolderID:string;

  const fileName = `archivo-${Date.now()}`;
  const year = new Date().getFullYear();
  
  //TODO: verifify if exists folder year
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

  if(folderDestination==='requisitos'){
    console.log('requisitos');
    const folderRequisitosExists = await checkIfFolderExists('requisitos', grupoFolderID);
    if(!folderRequisitosExists){
      const folderRequisitos = await createFolder('requisitos', grupoFolderID);
      requisitosFolderID = folderRequisitos.data.id;
      console.log(`Folder requisitos creado`)
    }else{
      requisitosFolderID = folderRequisitosExists.id;
      console.log(`Folder requisitos existe`)
    }
    return createFile(fileName, file, requisitosFolderID);
  }

  if(folderDestination==='matricula'){
    console.log('matricula');
    const folderMatriculaExists = await checkIfFolderExists('matricula', grupoFolderID);
    if(!folderMatriculaExists){
      const folderMatricula = await createFolder('matricula', grupoFolderID);
      matriculaFolderID = folderMatricula.data.id;
      console.log(`Folder matricula creado`)

    }else{
      matriculaFolderID = folderMatriculaExists.id;
      console.log(`Folder matricula existe`)

    }
    return createFile(fileName, file, matriculaFolderID);
  }

  if(folderDestination==='libro'){
    console.log('libro');
    const folderPagoLibroExists = await checkIfFolderExists('libro', grupoFolderID);
    if(!folderPagoLibroExists){
      const folderPagoLibro = await createFolder('libro', grupoFolderID);
      pagoLibroFolderID = folderPagoLibro.data.id;
      console.log(`Folder libro creado`)

    }else{
      pagoLibroFolderID = folderPagoLibroExists.id;
      console.log(`Folder libro existe`)

    }
    return createFile(fileName, file, pagoLibroFolderID);
  }

  if(folderDestination==='mensualidad'){
    console.log('mensualidad');
    const folderMensualidadExists = await checkIfFolderExists('mensualidad', grupoFolderID);
    if(!folderMensualidadExists){
      const folderMensualidad = await createFolder('mensualidad', grupoFolderID);
      mensualidadFolderID = folderMensualidad.data.id;
      console.log(`Folder mensualidad creado`)
      
    }else{
      mensualidadFolderID = folderMensualidadExists.id;
      console.log(`Folder mensualidad existe`)
    }
    return createFile(fileName, file, mensualidadFolderID);
  }

  return null;    
}