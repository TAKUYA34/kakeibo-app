const profileEditServiceTest = require('../../services/profileEditService');
const bcrypt = require('bcrypt');
const userEditRepositoryTest = require('../../repositories/profileEditRepository');

jest.mock('../../repositories/profileEditRepository');
jest.mock('bcrypt');

/* updateUserProfile 正常系テスト */
describe('updateUserProfile', () => {
  // 引数
  const userId = 'dummyUser45';
  const email = 'test@example.com';
  const user_name = '山田太郎';
  const password = 'newPassword123';

  // 検証毎に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('全て正常に更新できる', async () => {
    // モック
    userEditRepositoryTest.existingUser.mockResolvedValue({ _id: userId, password: password });
    userEditRepositoryTest.emailOwner.mockResolvedValue({ _id: userId });
    bcrypt.compare.mockResolvedValue(false);
    bcrypt.hash.mockResolvedValue('newHash');
    userEditRepositoryTest.updateUserById.mockResolvedValue({ success: true });

    // データをアップデートする
    const result = await profileEditServiceTest.updateUserProfile(userId, user_name, email, password);

    // 検証
    expect(result).toEqual({ success: true });
    expect(userEditRepositoryTest.updateUserById).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({ user_name, email, password: 'newHash'})
    );
  });
});

/* deleteUser 正常系テスト */
describe('deleteUser', () => {
  // 引数
  const userId = 'dummyUser45';

  // 検証毎に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('正常にユーザーを削除できる', async () => {
    // 削除成功
    userEditRepositoryTest.deleteUserById.mockResolvedValue({ success: true });

    // 結果をresultへ
    const result = await profileEditServiceTest.deleteUser(userId);

    // 検証
    expect(result).toEqual({ success: true });
    expect(userEditRepositoryTest.deleteUserById).toHaveBeenCalledWith(userId);
  });
});

/* updateUserProfile 異常系テスト */
describe('updateUserProfile', () => {
  // 引数
  const userId = 'dummyUser45';
  const email = 'test@example.com';
  const user_name = '山田太郎';
  const password = 'newPassword123';

  // 検証毎に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ユーザーが存在しない場合、例外スロー', async () => {
    // userId null
    userEditRepositoryTest.existingUser.mockResolvedValue(null);

    await expect(profileEditServiceTest.updateUserProfile(userId, email, user_name, password))
      .rejects.toThrow('ユーザーが見つかりません');
  });

  it('メールアドレスが他のユーザーに使われている場合、例外スロー', async () => {
    userEditRepositoryTest.existingUser.mockResolvedValue({ _id: userId, password: 'hashed'});
    userEditRepositoryTest.emailOwner.mockResolvedValue({_id: 'otherUser456'});

    await expect(profileEditServiceTest.updateUserProfile(userId, email, user_name, password))
      .rejects.toThrow('そのメールアドレスは既に使用されています');
  });

  it('以前と同じパスワードの場合、例外スロー', async () => {
    userEditRepositoryTest.existingUser.mockResolvedValue({ _id: userId, password: 'hashed'});
    userEditRepositoryTest.emailOwner.mockResolvedValue({ _id: userId});
    bcrypt.compare.mockResolvedValue(true); // パスワード一緒

    await expect(profileEditServiceTest.updateUserProfile(userId, email, user_name, password))
      .rejects.toThrow('以前と同じパスワードは使用できません');
  });
});

/* deleteUser 異常系テスト */
describe('deleteUser', () => {
  // 引数
  const userId = 'dummyUser45';

  // 検証毎に履歴をリセット
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('削除時にエラーが発生した場合、例外スロー', async () => {
    userEditRepositoryTest.deleteUserById.mockRejectedValue(new Error('削除に失敗しました'));

    await expect(profileEditServiceTest.deleteUser(userId))
      .rejects.toThrow('削除に失敗しました');
  });
});



