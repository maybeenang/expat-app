import ExportType from '../enums/ExportType';
import {PermissionUtils} from './permissionUtils';
import RNFS from 'react-native-fs';

export const FileUtils = {
  saveBase64: async (
    base64String: string,
    moduleName: string,
    type: ExportType,
    showSnackbar,
  ) => {
    try {
      const hasPermission = await PermissionUtils.requestStoragePermission();
      if (!hasPermission) {
        showSnackbar('Permission Denied: Cannot save file', 'error');
        return;
      }

      let extension = '';
      let cleanBase64 = '';

      if (type === ExportType.Excel) {
        extension = 'xlsx';
        cleanBase64 = base64String.replace(
          /^data:application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,/,
          '',
        );
      } else {
        extension = 'pdf';
        cleanBase64 = base64String.replace(
          /^data:application\/pdf;base64,/,
          '',
        );
      }

      const timestamp = new Date().getTime();
      const fileName = `${moduleName}_${timestamp}.${extension}`;
      const folderPath = `${RNFS.DownloadDirectoryPath}/demical`;

      const folderExists = await RNFS.exists(folderPath);
      if (!folderExists) {
        await RNFS.mkdir(folderPath);
      }

      const filePath = `${folderPath}/${fileName}`;
      await RNFS.writeFile(filePath, cleanBase64, 'base64');

      console.log('success export : ' + filePath);

      showSnackbar(`Berhasil menyimpan file: ${filePath}`, 'success', filePath, 2000);
      return filePath;
    } catch (error) {
      showSnackbar(`Gagal menyimpan file: ${error.message}`, 'error', null, 2000);
    }
  },
};
