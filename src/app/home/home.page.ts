import {Component} from '@angular/core';
import {PickerController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  defaultColumnOptions = [
    [
      'Dog',
      'Cat',
      'Bird',
      'Lizard',
      'Chinchilla'
    ]
  ];

  multiColumnOptions = [
    [
      'Minified',
      'Responsive',
      'Full Stack',
      'Mobile First',
      'Serverless'
    ],
    [
      'Tomato',
      'Avocado',
      'Onion',
      'Potato',
      'Artichoke'
    ]
  ];

  cascadeColumnOptions = [
    [
      '贵州省',
      '湖北省',
    ], [
      [
        '贵阳市',
        '遵义市',
        '凯里市',
        '六盘水市',
      ],
      [
        '武汉市',
        '黄石市',
        '十堰市',
        '宜昌市',
        '咸宁市'
      ]
    ]
  ];
  cascadeColumnValue = [0, 0]

  private cascadePicker;

  constructor(private pickerController: PickerController,
              private toastController: ToastController) {
  }

  async openPicker(numColumns = 1, numOptions = 5, columnOptions = this.defaultColumnOptions) {
    const picker = await this.pickerController.create({
      columns: this.getColumns(numColumns, numOptions, columnOptions),
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            console.log(value)
            if (numColumns == 1) {
              this.presentToast(value.col0.text)
            } else {
              this.presentToast(value.col0.text + ',' + value.col1.text)
            }
          }
        }
      ]
    });
    await picker.present();
  }

  async openCascadePicker(numColumns = 2, columnOptions = this.cascadeColumnOptions) {
    const pickerOptions = {
      columns: this.getCascadeColumns(2, columnOptions),
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (value) => {
            console.log(value)
            if (numColumns == 1) {
              this.presentToast(value.col0.text)
            } else {
              this.presentToast(value.col0.text + ',' + value.col1.text)
            }
          }
        }
      ]
    }


    // @ts-ignore
    this.cascadePicker = await this.pickerController.create(pickerOptions);

    await this.cascadePicker.present().then(() => {
      setTimeout(() => {
        try {
          const pickerCols = document.querySelectorAll('ion-picker-column');
          const provinceCol = pickerCols[0];
          const cityCol = pickerCols[1];

          provinceCol.addEventListener('ionPickerColChange', (event: CustomEvent) => {
            console.log(event)
            this.cascadeColumnValue[0] = event.detail.selectedIndex
            this.cascadePicker.columns = this.getCascadeColumns(2, this.cascadeColumnOptions)
          })

          cityCol.addEventListener('ionPickerColChange', (event: CustomEvent) => {
            this.cascadeColumnValue[1] = event.detail.selectedIndex
            console.log(event)
          })
        } catch (e) {
          console.log(e);
        }
      }, 400);
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    await toast.present();
  }

  getColumns(numColumns, numOptions, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }
    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      })
    }
    return options;
  }

  getCascadeColumns(numColumns, columnOptions) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col${i}`,
        options: this.getCascadeColumnOptions(i, columnOptions),
        selectedIndex: this.cascadeColumnValue[i]
      });
    }
    return columns;
  }

  getCascadeColumnOptions(columnIndex, columnOptions) {
    let options = [];
    if (columnIndex == 0) {
      for (let i = 0; i < columnOptions[columnIndex].length; i++) {
        options.push({
          text: columnOptions[columnIndex][i],
          value: i,
        })
      }
    } else {
      let provinceIndex = this.cascadeColumnValue[0];
      for (let i = 0; i < columnOptions[columnIndex][provinceIndex].length; i++) {
        options.push({
          text: columnOptions[columnIndex][provinceIndex][i],
          value: i,
        })
      }
    }
    console.log(options)
    return options;
  }
}
