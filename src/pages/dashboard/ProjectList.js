import React, { useEffect, useState } from 'react';
import { DashboardContentWrapper } from './UserList';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { apiURI } from '../../vars/api';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
        </GridToolbarContainer>
    );
}

function ProjectListComponent({ data }) {
    const history = useHistory();
    const rowsAndColumns = {
        rows: [], columns: [
            { field: 'idx', headerName: 'idx' },
            { field: 'category', headerName: '카테고리', width: 150 },
            { field: 'title', headerName: '제목', flex: 1 },
            { field: 'goto', headerName: '보러가기', width: 100 },
            { field: 'edit', headerName: '수정하기', width: 100 },
            { field: 'delete', headerName: '삭제하기', width: 100 },
            { field: 'desginers', headerName: '디자이너 리스트', width: 200 },
        ]
    };
    rowsAndColumns.rows = data.map((x, i) => {
        const postData = JSON.parse(x.post_content_no_rendered);
        return {
            id: x.id,
            idx: i + 1,
            category: x.categories_title[0],
            title: x.title.rendered,
            desginers: postData.designerList.map(x => x.name).join(", "),
            goto: "보러가기",
        }
    });
    return (
        <DashboardContentWrapper>
            <DataGrid
                onCellClick={(e) => {
                    switch (e.field) {
                        case "goto":
                            history.push(`/project/${e.id}`);
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

function ProjectList() {
    const { user } = useSelector(s => s);
    const INITIAL_DATA = {
        loading: true,
        data: null,
        error: false,
        imgLoaded: false,
    };
    const [data, setData] = useState(INITIAL_DATA);
    useEffect(() => {
        if (data.loading) {
            (async () => {
                try {
                    const userListData = await axios.get(apiURI + `wp/v2/posts?author=${user.data.wordpressData.id}`, {
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
            <ProjectListComponent data={data.data} />
    );
}

export default ProjectList;