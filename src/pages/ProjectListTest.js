import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { DashboardContentWrapper } from './dashboard/UserList';
import { apiURI } from '../vars/api';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport
        csvOptions={{
          allColumns: true,
          utf8WithBom: true,
        }} />
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );
}

function ListComponent(data) {
  const history = useHistory();
  const rowsAndColumns = {
    rows: [], columns: [
      { field: 'id', headerName: 'idx' },
      { field: 'category_name', headerName: '카테고리' },
      { field: 'title', headerName: '제목', flex: 1 },
      { field: 'related_project', headerName: '연관', flex: 1 },
      { field: 'designer_list', headerName: '디자이너 리스트' },
      { field: 'edit', headerName: '수정하기', width: 100 },
      { field: 'goto', headerName: '보러가기', width: 100 },
    ]
  };
  rowsAndColumns.rows = data.data.posts.map(x => ({
    ...x,
    title: x.title.replace(",", " ") + " | " + x.subtitle.replace(",", " "),
    designer_list: x.designer_list?.map(x => x.name.replace(",", " "))?.join(" | "),
    goto: "보러가기",
    edit: "수정하기",
    delete: "삭제하기",
  }));
  return (
    <DashboardContentWrapper>
      <DataGrid
        onCellClick={(e) => {
          switch (e.field) {
            case "goto":
              history.push(`/project/${e.id}`);
              break;
            case "edit":
              history.push(`/my-dashboard/edit-work/${e.id}`);
              break;
          }
        }}
        rows={rowsAndColumns.rows} rowHeight={80}
        columns={rowsAndColumns.columns}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </DashboardContentWrapper>
  );
}

function ProjectListTest() {
  const INITIAL_DATA = {
    loading: false,
    data: null,
    error: false,
    imgLoaded: false,
    loggedIn: sessionStorage.getItem('khvd_project_list_read_permission') === '1' || false,
  };
  const [data, setData] = useState(INITIAL_DATA);
  useEffect(() => {
    if (data.loggedIn) {
      setData(s => ({
        ...s,
        loading: true
      }));
    }
  }, [data.loggedIn]);
  useEffect(() => {
    if (data.loading && data.loggedIn) {
      (async () => {
        try {
          const userListData = await axios.get(apiURI + `khvd/v1/project?cat=2,3,4,5`);
          setData(s => ({
            ...s,
            loading: false,
            data: userListData.data,
          }));
        } catch (e) {
          setData(s => ({
            ...s,
            loading: false,
            error: e,
          }));
        }
      })();
    }
  }, [data.loading]);
  if (data.loading) return null;
  if (!data.loggedIn) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%'
    }}>
      <form onSubmit={(e) => {
        e.preventDefault();
        const input = e.target.querySelector("input").value;
        const password = 'khvd2021!@34';
        if (input === password) {
          setData(s => ({
            ...s,
            loading: true,
            loggedIn: true,
          }));
          sessionStorage.setItem('khvd_project_list_read_permission', '1');
        } else {
          window.alert("비밀번호가 다릅니다!");
        }
      }}>
        <input placeholder="비밀번호" type="password" />
        <button>입력</button>
      </form>
    </div>
  )
  if (!data.data) return null;
  return (
    <StyledProjecList>
      <ListComponent data={data.data} reload={() => {
        setData(s => ({
          ...s,
          loading: true,
          data: null,
        }));
      }} />
    </StyledProjecList>
  );
}

export default ProjectListTest;

const StyledProjecList = styled.div`
  height:100%;
  /* background-image: url('/img/background.png'); */
  /* position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0; */
`;