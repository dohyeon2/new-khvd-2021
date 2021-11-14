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

function ProjectListComponent({ data, reload }) {
    const QRCode = window.QRCode;
    const history = useHistory();

    const rowsAndColumns = {
        rows: [], columns: [
            { field: 'idx', headerName: 'idx' },
            { field: 'category', headerName: '카테고리', width: 150 },
            { field: 'title', headerName: '제목', flex: 1 },
            { field: 'related_project', headerName: '연관 프로젝트' },
            { field: 'goto', headerName: '보러가기', width: 100 },
            { field: 'edit', headerName: '수정하기', width: 100 },
            { field: 'delete', headerName: '삭제하기', width: 100 },
            { field: 'desginers', headerName: '디자이너 리스트', width: 200 },
            { field: 'qrcode', headerName: 'QR코드', width: 100 },
        ]
    };

    rowsAndColumns.rows = data.posts.map((x, i) => {
        return {
            id: x.id,
            idx: i + 1,
            category: x.category_name,
            category_slug: x.category_slug,
            title: x.title,
            related_project: x.related_project || "-",
            desginers: x.designer_list.map(x => x.name).join(", "),
            goto: "보러가기",
            edit: "수정하기",
            delete: "삭제하기",
            qrcode: "",
        }
    });
    useEffect(() => {

    }, []);
    return (
        <DashboardContentWrapper>
            <DataGrid
                onStateChange={() => {
                    const qrcodeCell = document.querySelectorAll(`[aria-rowindex]`);
                    for (let i = 1, len = qrcodeCell.length; i < len; i++) {
                        const cell = qrcodeCell[i].querySelector(`[data-field="qrcode"]`);
                        if (!cell.querySelector("img")) {
                            const qrcode = new QRCode(cell, `${window.location.origin}/project/${data.posts[i - 1].category_slug}/${data.posts[i - 1].id}`);
                            cell.querySelector('img').style.cssText = `width:100%`;
                        }
                    }
                }}
                onCellClick={(e) => {
                    const slug = data.posts.find(x => x.id === e.id).category_slug;
                    switch (e.field) {
                        case "goto":
                            history.push(`/project/${slug}/${e.id}`);
                            break;
                        case "edit":
                            history.push(`/my-dashboard/edit-work/${e.id}`);
                            break;
                        case "delete":
                            const deleteConfirm = window.confirm("정말 삭제합니까?");
                            if (deleteConfirm) {
                                (async () => {
                                    try {
                                        const token = localStorage.getItem("khvd_user_token");
                                        await axios.delete(apiURI + `khvd/v1/project/${e.id}`, {
                                            headers: {
                                                Authorization: "Bearer " + token,
                                            }
                                        });
                                    } catch (e) {
                                        e.response?.data?.message && window.alert(e.response.data.message);
                                    }
                                    reload && reload();
                                })();
                            }
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
                    const userListData = await axios.get(apiURI + `khvd/v1/project?author=${user.data.wordpressData.id}`, {
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
    }, [data.loading]);
    if (data.loading) return null;
    if (!data.data) return null;
    return (
        <ProjectListComponent data={data.data} reload={() => {
            setData(s => ({
                ...s,
                loading: true,
                data: null,
            }));
        }} />
    );
}

export default ProjectList;