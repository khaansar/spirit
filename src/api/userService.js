import apiClient from './client';

export const userService = {
  /**
   * Fetches current authenticated user profile
   */
  async getCurrentUser() {
    return await apiClient.get('/auth-api/users/me');
  },

  /**
   * Updates student personal profile info (firstName, lastName, phone, targetExam)
   */
  async updateProfile(payload) {
    try {
      return await apiClient.put('/auth-api/users/me', payload);
    } catch (err) {
      if (err?.status === 404 || err?.status === 405) {
        return await apiClient.patch('/auth-api/users/me', payload);
      }
      throw err;
    }
  },

  /**
   * Changes account security password
   */
  async changePassword({ currentPassword, newPassword }) {
    try {
      return await apiClient.post('/auth-api/users/me/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (err) {
      if (err?.status === 404) {
        try {
          return await apiClient.post('/auth-api/change-password', {
            currentPassword,
            newPassword,
          });
        } catch (subErr) {
          if (subErr?.status === 404) {
            return await apiClient.put('/auth-api/users/me/password', {
              currentPassword,
              newPassword,
            });
          }
        }
      }
      throw err;
    }
  },

  /**
   * Deletes avatar photo
   */
  async removeAvatar() {
    try {
      return await apiClient.delete('/auth-api/users/me/avatar');
    } catch (err) {
      if (err?.status === 404 || err?.status === 405) {
        return await apiClient.put('/auth-api/users/me', { removeAvatar: true, avatarUrl: '' });
      }
      throw err;
    }
  },
};

export default userService;
