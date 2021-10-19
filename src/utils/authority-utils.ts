import store from '@/store';

/**
 * 登入的使用者是否可以編輯對象角色(檢查 rank 是否小於修改對象)
 */
export const allowEditRank = (rank: number) => {
    const { role } = store.state.App.user;
    return role.rank === 0 || role.rank < rank;
};
