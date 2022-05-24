import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MediaService } from 'src/app/services';
import { File } from 'src/app/models';

@Component({
  selector: 'app-attach-file',
  templateUrl: './attach-file.component.html',
  styleUrls: ['./attach-file.component.scss'],
})
export class AttachFileComponent implements OnInit {
  @Output() url = new EventEmitter<object>();
  data: Partial<File>;
  currentFile: File = null;
  @Input() path: string;

  constructor(
    private ms: MediaService
  ) { }

  ngOnInit() {
   }

  async onLoad(event) {
    if (event.target.files[0]) {
      // if (!this.currentFile) {
      //   this.data = await this.ms.onUploadFles(this.path, event.target.files[0]);
      // } else {
      //   this.ms.deleteImgStorage(this.currentFile.filePath);
      //   this.data = await this.ms.onUploadFles(this.path, event.target.files[0]);
      // }
      if (this.currentFile) { await this.ms.deleteImgStorage(this.currentFile.filePath); }
      this.data = await this.ms.onUploadFles(this.path, event.target.files[0]);
      this.currentFile = {
        url: this.data.url,
        filePath: this.data.filePath,
        name: event.target.files[0].name,
        type: event.target.files[0].type,
      };
      this.url.emit(this.currentFile);
    }
  }

}
