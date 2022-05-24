import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { SharedService } from './shared.service';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { File } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  nameImg: string;
  timstamp: number;
  filePath: string;
  urlImage = '';
  uploadPercent: Observable<number>;

  constructor(
    private ss: SharedService,
    private storage: AngularFireStorage
  ) { }


  onUploadFles(route: string, image: File) {
    return new Promise<object>((resolve, reject) => {
      this.timstamp = this.ss.getDate().getTime();
      this.nameImg = image.name;
      this.filePath = `${route}/${this.timstamp}_${this.nameImg}`;
      const fileRef = this.storage.ref(this.filePath);
      const task = this.storage.upload(this.filePath, image);
      this.uploadPercent = task.percentageChanges();
      task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlImage => {
            const data: Partial<File> = {
              url: urlImage,
              filePath: this.filePath
            };
            this.uploadPercent = null;
            resolve(data);
          });
        })
      ).subscribe();
     });
  }

  deleteImgStorage(filePath: string) {
    this.filePath = null;
    this.uploadPercent = null;
    return this.storage.ref(filePath).delete().toPromise();
  }

  public onUpload(imagen, canvasId: string, size: number) {
    return new Promise<string>((resolve, reject) => {
      let canvas;
      canvas = document.getElementById(canvasId);
      const reader = new FileReader();
      reader.readAsDataURL(imagen.target.files[0]);
      return reader.onload = (e) => {
        const contImage = e.target.result;
        const tempImg: any = new Image();
        tempImg.src = contImage;
        return tempImg.onload = () => {
          // tamaño maximo para la imagen una vez comprimida
          const MAX_WIDTH = size;
          const MAX_HEIGHT = size;
          let tempW = tempImg.width;
          let tempH = tempImg.height;
          // Aqui se hace las validaciones
          if (tempW > tempH) {
            if (tempW > MAX_WIDTH) {
              tempH *= MAX_WIDTH / tempW;
              tempW = MAX_WIDTH;
            } else {
              if (tempH > MAX_HEIGHT) {
                tempW *= MAX_HEIGHT / tempH;
                tempH = MAX_HEIGHT;
              }
            }
          } else {
            if (tempW > MAX_WIDTH) {
              tempH *= MAX_WIDTH / tempW;
              tempW = MAX_WIDTH;
            } else {
              if (tempH > MAX_HEIGHT) {
                tempW *= MAX_HEIGHT / tempH;
                tempH = MAX_HEIGHT;
              }
            }
          }
          // Se inserta la imagen original en el cavas y alli se reestructura con los tamaños logrados en la conversion
          if (navigator.platform === 'iPad' || navigator.platform === 'iPhone' || navigator.platform === 'iPod') {
            canvas.width = tempH;
            canvas.height = tempW;
            // creacion variable canvas
            const ctx = canvas.getContext('2d');
            ctx.rotate(90 * Math.PI / 180);
            ctx.translate(0, -canvas.width);
            ctx.drawImage(tempImg, 0, 0, tempW, tempH);
            // Se obtiene el url en base64
            const dataURL = canvas.toDataURL('image/jpeg');
            resolve(dataURL);
          } else {
            // Se asigna los tamaños nuevos al canvas
            canvas.width = tempW;
            canvas.height = tempH;
            // creacion variable canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(tempImg, 0, 0, tempW, tempH);
            // Se obtiene el url en base64
            const dataURL = canvas.toDataURL('image/jpeg');
            resolve(dataURL);
          }
        };
      };
     });
  }

  rotateAvatar(canvasId: string, size: number) {
    return new Promise<string>((resolve, reject) => {
      let canvas;
      let url: string;
      url = document.getElementById('imgAvatar').getAttribute('src');
      canvas = document.getElementById(canvasId);
      const tempImg = new Image();
      tempImg.src = url;
      tempImg.onload = () => {
        // tamaño maximo para la imagen una vez comprimida
        const MAX_WIDTH = size;
        const MAX_HEIGHT = size;
        let tempW = tempImg.width;
        let tempH = tempImg.height;
        // Aqui se hace las validaciones
        if (tempW > tempH) {
          if (tempW > MAX_WIDTH) {
            tempH *= MAX_WIDTH / tempW;
            tempW = MAX_WIDTH;
          } else {
            if (tempH > MAX_HEIGHT) {
              tempW *= MAX_HEIGHT / tempH;
              tempH = MAX_HEIGHT;
            }
          }
        } else {
          if (tempW > MAX_WIDTH) {
            tempH *= MAX_WIDTH / tempW;
            tempW = MAX_WIDTH;
          } else {
            if (tempH > MAX_HEIGHT) {
              tempW *= MAX_HEIGHT / tempH;
              tempH = MAX_HEIGHT;
            }
          }
        }
        // Se inserta la imagen original en el cavas y alli se reestructura con los tamaños logrados en la conversion
        canvas.width = tempH;
        canvas.height = tempW;
        // creacion variable canvas
        const ctx = canvas.getContext('2d');
        ctx.rotate(90 * Math.PI / 180);
        ctx.translate(0, -canvas.width);
        ctx.drawImage(tempImg, 0, 0, tempW, tempH);
        // Se obtiene el url en base64
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
    });
  }

}
