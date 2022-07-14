import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { MediaService } from "src/app/services";
import { File } from "src/app/models";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-attach-file",
  templateUrl: "./attach-file.component.html",
  styleUrls: ["./attach-file.component.scss"],
})
export class AttachFileComponent implements OnInit {
  @Output() url = new EventEmitter<object>();
  data: Partial<File>;
  @Input() currentFile?: File = null;
  @Input() path: string;

  constructor(
    private ms: MediaService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async onLoad(event) {
    if (event.target.files[0]) {
      if (event.target.files[0].type === "application/pdf" || event.target.files[0].type.includes('image')) {
        console.log(event.target.files[0]);
        if (this.currentFile) {
          await this.ms.deleteImgStorage(this.currentFile.filePath);
        }
        this.data = await this.ms.onUploadFles(
          this.path,
          event.target.files[0]
        );
        this.currentFile = {
          url: this.data.url,
          filePath: this.data.filePath,
          name: event.target.files[0].name,
          type: event.target.files[0].type,
        };
        this.url.emit(this.currentFile);
        const inputElement: any = document.getElementById("file");
        inputElement.value = "";
      } else {
        this.presentAlert();
      }
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'Alert!',
      subHeader: 'Important message',
      message: `<ion-icon class="yellow" name="cloud-offline"></ion-icon>Only PDF file or image.`,
      buttons: ['OK']
    });

    await alert.present();
  }
}
