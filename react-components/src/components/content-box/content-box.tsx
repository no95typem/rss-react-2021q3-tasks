import * as React from 'react';
import { DataRecord, DataRecordData } from '../record/record';
import { SearchBar } from '../search-bar/search-bar';

import styles from './content-box.scss';

export class ContentBox extends React.Component<{
  memory: Record<string, DataRecordData>;
  onChange: (
    rec: DataRecordData,
    e: React.ChangeEvent,
    key: keyof DataRecordData,
  ) => void;
}> {
  state = {
    searchQuery: '',
  };

  render(): JSX.Element {
    return (
      <div className={styles.root}>
        <SearchBar
          text={this.state.searchQuery}
          onChange={this.handleSearchBarChange}
        ></SearchBar>
        <div className={styles.root__content}>
          {Object.values(this.props.memory)
            .filter(rec => {
              if (this.state.searchQuery === '') return true;
              const lowercased = this.state.searchQuery;
              if (
                rec.title.toLowerCase().includes(lowercased) ||
                rec.artist?.toLowerCase().includes(lowercased) ||
                rec.genre?.toLowerCase().includes(lowercased)
              )
                return true;
              return false;
            })
            .map(rec => {
              return (
                <article
                  className={styles.root__card}
                  key={rec.id}
                  style={{
                    order: rec.pinnedOrder || 0,
                  }}
                >
                  <DataRecord
                    data={rec}
                    params={{
                      full: true,
                      onChange: (e, key) => this.props.onChange(rec, e, key),
                    }}
                  />
                </article>
              );
            })}
        </div>
      </div>
    );
  }

  handleSearchBarChange = (e: React.ChangeEvent): void => {
    this.setState(() => {
      return { searchQuery: (e.target as HTMLInputElement).value };
    });
  };
}
