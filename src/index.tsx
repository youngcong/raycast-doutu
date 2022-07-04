import { useEffect, useState } from 'react';
import { ActionPanel, Action, Icon, Grid } from '@raycast/api';
import { fetchGIFs, searchGIFs } from './utils/request';
import { DoutuItem } from './models';
import copyFileToClipboard from './utils/copyFileToClipboard';

export default function Command() {
  const [itemSize, setItemSize] = useState<Grid.ItemSize>(Grid.ItemSize.Medium);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const [pictures, setPictures] = useState<DoutuItem[]>([]);

  async function defaultFetch() {
    setIsLoading(true);
    const data = await fetchGIFs();
    setIsLoading(false);
    setPictures(data);
  }

  useEffect(() => {
    if (!searchText) {
      defaultFetch();
      return;
    }

    const fetching = async () => {
      setIsLoading(true);
      const data = await searchGIFs({ keyword: searchText });
      setIsLoading(false);
      setPictures(data);
    };

    fetching();
  }, [searchText]);

  return (
    <Grid
      itemSize={itemSize}
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarAccessory={
        <Grid.Dropdown
          tooltip="Grid Item Size"
          storeValue
          onChange={(newValue) => {
            setItemSize(newValue as Grid.ItemSize);
            setIsLoading(false);
          }}
        >
          <Grid.Dropdown.Item title="Large" value={Grid.ItemSize.Large} />
          <Grid.Dropdown.Item title="Medium" value={Grid.ItemSize.Medium} />
          <Grid.Dropdown.Item title="Small" value={Grid.ItemSize.Small} />
        </Grid.Dropdown>
      }
    >
      {!isLoading &&
        pictures.map(({ id, url, fileName }) => (
          <Grid.Item
            key={id}
            content={{ source: url }}
            actions={
              <ActionPanel>
                <Action
                  icon={Icon.Clipboard}
                  key="copyFile"
                  title="Copy GIF"
                  onAction={() => copyFileToClipboard(url, fileName)}
                  shortcut={{ modifiers: ['cmd', 'opt'], key: 'c' }}
                />
              </ActionPanel>
            }
          />
        ))}
    </Grid>
  );
}
