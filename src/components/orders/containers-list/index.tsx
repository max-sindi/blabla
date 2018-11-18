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

  // public serializeFromServerTemplate = {
  //   // containerLine: 'trailerLine',
  //   trailerLine: 'containerLine',
  //   // containerType: 'trailerType',
  //   trailerType: 'containerType',
  //   cargoName: 'cargoName',
  //   cargoWeight: 'cargoWeight',
  //   // cargoPackageType: 'packageType',
  //   packageType: 'cargoPackageType',
  //   uniqueId: 'uniqueId',
  //   genset_temperature: 'genset_temperature',
  //   price: 'price'
  // };

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
      <table>
        <thead>
          <tr>
            <th className={styles.cell}>Тип Контейнера</th>
            <th className={styles.cell}>Линия Контейнера</th>
            <th className={styles.cell}>Назавание Груза</th>
            <th className={styles.cell}>Вес Груза</th>
            <th className={styles.cell}>Температура</th>
            <th className={styles.cell}>Вид Упаковки</th>
            <th className={styles.cell}>Редактировать</th>
            <th className={styles.cell}>Количество</th>
            <th className={styles.cell}>Цена</th>
          </tr>
        </thead>
        <tbody>
          {this.props.list.map((row: any, index: any) => {
            const serialized = serialize(this.serializeTemplate, row);

            return (
              <tr
                key={serialized.uniqueId}
              >
                <td>
                  {this.props.getName(
                    'containerTypeList',
                    serialized.containerType
                  )}
                </td>
                <td>
                  {this.props.getName(
                    'containerLineList',
                    serialized.containerLine
                  )}
                </td>
                <td>{serialized.cargoName}</td>
                <td>{serialized.cargoWeight}</td>
                <td>{serialized.genset_temperature}</td>
                <td>{serialized.cargoPackageType}</td>
                <td>
                  <IconButton
                    onClick={this.editContainer(row)}
                    color="primary"
                    aria-label="Add"
                  >
                    <Edit />
                  </IconButton>
                </td>
                <td>{this.renderCopy(row)}</td>
                <td className={styles.containers__lastTableCell}>
                  {serialized.price}
                  <button
                    className={styles.container__deleteButton}
                    onClick={() => this.deleteContainer(index)}
                  >
                    +
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
