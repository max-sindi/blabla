import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import FileCopy from '@material-ui/icons/Flag';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Edit from '@material-ui/icons/Edit';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as styles from './style.css';

// import { findProperty } from '../../../utils/field-list';
import { serialize } from '../../../utils/serialize';

interface IProps {
  edit: any;
  copy: any;
  list: any;
  getName: any;
  deleteContainer: any;
  isEditPage: boolean;
}

interface IState {
  copyForm: boolean;
  selectedRow: any
  countCopy: number
}

export default class ContainersList extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props);
  }

  public state: IState = {
    copyForm: false,
    selectedRow: null,
    countCopy: 1
  };

  public serializeTemplate = {
    containerLine: 'trailerLine',
    containerType: 'trailerType',
    cargoName: 'cargoName',
    cargoWeight: 'cargoWeight',
    cargoPackageType: 'packageType',
    uniqueId: 'uniqueId',
    genset_temperature: 'genset_temperature',
    price: 'price'
  };

  public editContainer = (container: any) => {
    return () => {
      this.props.edit(container);
    };
  };

  public copyContainer = (container: any) => {
    return () => {
      this.props.copy(container, this.state.countCopy);
      this.setState({
        copyForm: false,
        countCopy: 1
      });
    };
  };

  public copyToggle = (row: any) => {
    return ()=>{
      this.setState({
        selectedRow: row,
        copyForm: true
      });
    }
  };

  public changeCount = (event: any) => {
    this.setState({
      countCopy: event.target.value,
    });
  };

  public renderCopy = (row: any) => {

      return this.state.copyForm &&  this.state.selectedRow === row ? (
        <div className={styles.containerCount}>
          <div className={styles.inputContainer}>
            <input
              className={styles.countInput}
              onChange={this.changeCount}
              id="name-simple"
              value={this.state.countCopy}
            />
          </div>
          <div>
            <IconButton
              onClick={this.copyContainer(row)}
              color="primary"
              aria-label="Add"
            >
              <CheckCircle />
            </IconButton>
          </div>
        </div>
      ) : (
        <IconButton onClick={this.copyToggle(row)} color="primary" aria-label="Add">
          <FileCopy />
        </IconButton>
      );
  };

  public deleteContainer = (index: any) => {
    this.props.deleteContainer(index);
  }

  public render() {
    return (
        <div>
          {this.props.list.map((row: any, index: any) => {
            const serialized = serialize(this.serializeTemplate, row);
            return (
              <div
                className={styles.row}
                key={serialized.uniqueId}
              >
                <div className={styles.row__cell}>
                  <div className={styles.row__cellTitle}>
                    Тип Контейнера
                  </div>
                  <div className={styles.row__cellValue}>
                    {this.props.getName(
                      'containerTypeList',
                      serialized.containerType
                    )}
                  </div>
                </div>
                <div className={styles.row__cell}>
                  <div className={styles.row__cellTitle}>
                    Линия
                  </div>
                  <div className={styles.row__cellValue}>
                    {this.props.getName(
                      'containerLineList',
                      serialized.containerLine
                    )}
                  </div>
                </div>
                <div className={styles.row__cell}>
                  <div className={styles.row__cellTitle}>
                    Назавание Груза
                  </div>
                  <div className={styles.row__cellValue}>
                    {serialized.cargoName}
                  </div>
                 </div>
                <div className={styles.row__cell}>
                  <div className={styles.row__cellTitle}>
                    Вес Груза
                  </div>
                  <div className={styles.row__cellValue}>
                    {serialized.cargoWeight}
                  </div>
                 </div>
                <div className={styles.row__cell}>
                  <div className={styles.row__cellTitle}>
                    Температура
                  </div>
                  <div className={styles.row__cellValue}>
                    {serialized.genset_temperature}
                  </div>
                 </div>
                <div className={styles.row__cell}>
                  <div className={styles.row__cellTitle}>
                    Вид Упаковки
                  </div>
                  <div className={styles.row__cellValue}>
                    {serialized.cargoPackageType}
                  </div>
                 </div>
                {/* <div>{this.renderCopy(row)}</div> */}
                <div className={styles.row__cell}>
                  <div className={styles.row__cellTitle}>
                    Цена
                  </div>
                  <div className={styles.row__cellValue}>
                    {serialized.price}
                  </div>
                </div>
                <div className={styles.row__cell}>
                  <IconButton
                    onClick={this.editContainer(row)}
                    color="primary"
                    aria-label="Add"
                    >
                      <Edit />
                    </IconButton>
                  <button
                    className={styles.container__deleteButton}
                    onClick={() => this.deleteContainer(index)}
                    >
                      +
                    </button>
                </div>
              </div>
            );
          })}
        </div>
    );
  }
}
