import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { apiURI } from '../../vars/api';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarExport csvOptions={{
                utf8WithBom: true
            }} />
            <GridToolbarFilterButton />
        </GridToolbarContainer>
    );
}

function UserListComponent(data) {
    const users = data.data.users;
    const rowsAndColumns = {
        rows: [], columns: [
            { field: 'id', headerName: 'idx', flex: 1 },
            { field: '1_student_number', headerName: '학번', flex: 1 },
            { field: 'display_name', headerName: '이름', flex: 1 },
            { field: 'contact', headerName: '컨택트', flex: 1 },
            { field: 'question_0', headerName: 'Q. 나를 표현하는 색상 코드와 그 이유는?', flex: 1 },
            { field: 'question_1', headerName: 'Q. 내가 가장 행복했던 언박싱의 순간은?', flex: 1 },
            { field: 'question_2', headerName: 'Q. 졸전을 준비하며, 가장 많이 들었던 나의 원픽 노동요는?', flex: 1 },
            { field: 'question_3', headerName: 'Q. 졸전이 끝나면 가장 먼저 하고 싶은 것은?', flex: 1 },
            { field: 'question_4', headerName: 'Q. 졸업하며 한마디!', flex: 1 },
        ]
    };
    rowsAndColumns.rows = users.map((x, i) => {
        const dataObj = {};
        dataObj['contact'] = [];
        if (x.meta) {
            const meta = Object.keys(x.meta);
            meta.forEach(key => {
                if (/contact_[\d]/i.test(key)) {
                    dataObj["contact"].push(x.meta[key].value);
                } else {
                    dataObj[key] = x.meta[key].value;
                }
            });
            dataObj["question_0"] = x.meta["question_0_add"].value + " " + dataObj["question_0"];
            dataObj["contact"] = dataObj["contact"].join(" | ");
        }
        const rows = {
            id: i + 1,
            display_name: x.display_name,
            ...dataObj,
        };
        return rows;
    });
    return (
        <DashboardContentWrapper>
            <DataGrid rows={rowsAndColumns.rows} rowHeight={80}
                columns={rowsAndColumns.columns}
                components={{
                    Toolbar: CustomToolbar,
                }}
            />
        </DashboardContentWrapper>
    );
}

function UserList() {
    const INITIAL_DATA = {
        loading: true,
        data: null,
        error: false,
    };
    const [data, setData] = useState(INITIAL_DATA);
    useEffect(() => {
        if (data.loading) {
            (async () => {
                try {
                    const userListData = await axios.get(apiURI + `khvd/v1/users?nopaging=true`, {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("khvd_user_token"),
                        }
                    });
                    setData(s => ({
                        ...s,
                        loading: false,
                        data: userListData.data,
                    }));
                } catch (e) {
                    console.log(e);
                    setData(s => ({
                        ...s,
                        loading: false,
                        error: e,
                    }));
                }
            })();
        }
    }, []);
    if (data.loading) return null;
    return (
        <UserListComponent data={data.data} />
    );
}

export default UserList;

export const DashboardContentWrapper = styled.div`
    display: flex;
    height:100%;
    padding:20px;
    box-sizing:border-box;
    .MuiDataGrid-cell{
        white-space: pre-wrap !important;
        line-height: 1.6 !important;
        word-break: break-all !important;
        text-overflow: unset !important;
        overflow:auto !important;
    }
`;
