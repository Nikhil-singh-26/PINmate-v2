// ============================================
// Firebase v9 Admin Operations
// All CRUD operations for admin panel
// ============================================

import {
  auth,
  db,
  isUserAdmin,
  ref,
  get,
  set,
  update,
  remove,
  query,
  orderByChild,
  limitToFirst,
  onValue
} from './firebase.js';

// ============================================
// COLLEGES MANAGEMENT
// ============================================
export async function addCollege(collegeData) {
  try {
    const collegeId = Date.now().toString();
    const collegeRef = ref(db, `colleges/${collegeId}`);
    
    await set(collegeRef, {
      id: collegeId,
      name: collegeData.name,
      city: collegeData.city,
      state: collegeData.state,
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser.uid
    });
    
    // Log admin action
    await logAdminAction('college_added', `Added college: ${collegeData.name}`);
    console.log('✅ College added:', collegeId);
    return collegeId;
  } catch (err) {
    console.error('❌ Error adding college:', err);
    throw err;
  }
}

export async function getColleges() {
  try {
    const collegesRef = ref(db, 'colleges');
    const snapshot = await get(collegesRef);
    
    if (!snapshot.exists()) {
      console.log('ℹ️ No colleges found');
      return [];
    }
    
    const colleges = [];
    snapshot.forEach(child => {
      colleges.push(child.val());
    });
    
    console.log(`✅ Fetched ${colleges.length} colleges`);
    return colleges;
  } catch (err) {
    console.error('❌ Error fetching colleges:', err);
    throw err;
  }
}

export async function updateCollege(collegeId, updates) {
  try {
    const collegeRef = ref(db, `colleges/${collegeId}`);
    
    await update(collegeRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser.uid
    });
    
    await logAdminAction('college_updated', `Updated college: ${collegeId}`);
    console.log('✅ College updated:', collegeId);
    return true;
  } catch (err) {
    console.error('❌ Error updating college:', err);
    throw err;
  }
}

export async function deleteCollege(collegeId, collegeName) {
  try {
    const collegeRef = ref(db, `colleges/${collegeId}`);
    
    await remove(collegeRef);
    
    await logAdminAction('college_deleted', `Deleted college: ${collegeName}`);
    console.log('✅ College deleted:', collegeId);
    return true;
  } catch (err) {
    console.error('❌ Error deleting college:', err);
    throw err;
  }
}

// ============================================
// USER MANAGEMENT
// ============================================
export async function getAllUsers() {
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      console.log('ℹ️ No users found');
      return [];
    }
    
    const users = [];
    snapshot.forEach(child => {
      users.push({
        uid: child.key,
        ...child.val()
      });
    });
    
    console.log(`✅ Fetched ${users.length} users`);
    return users;
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    throw err;
  }
}

export async function promoteUserToAdmin(uid, userEmail) {
  try {
    const userRef = ref(db, `users/${uid}`);
    
    await update(userRef, {
      role: 'admin',
      promotedAt: new Date().toISOString(),
      promotedBy: auth.currentUser.uid
    });
    
    await logAdminAction('user_promoted', `Promoted to admin: ${userEmail}`);
    console.log('✅ User promoted to admin:', uid);
    return true;
  } catch (err) {
    console.error('❌ Error promoting user:', err);
    throw err;
  }
}

export async function demoteAdminToUser(uid, userEmail) {
  try {
    const userRef = ref(db, `users/${uid}`);
    
    await update(userRef, {
      role: 'user',
      demotedAt: new Date().toISOString(),
      demotedBy: auth.currentUser.uid
    });
    
    await logAdminAction('user_demoted', `Demoted from admin: ${userEmail}`);
    console.log('✅ User demoted to regular:', uid);
    return true;
  } catch (err) {
    console.error('❌ Error demoting user:', err);
    throw err;
  }
}

export async function disableUser(uid, userEmail) {
  try {
    const userRef = ref(db, `users/${uid}`);
    
    await update(userRef, {
      disabled: true,
      disabledAt: new Date().toISOString(),
      disabledBy: auth.currentUser.uid
    });
    
    await logAdminAction('user_disabled', `Disabled user: ${userEmail}`);
    console.log('✅ User disabled:', uid);
    return true;
  } catch (err) {
    console.error('❌ Error disabling user:', err);
    throw err;
  }
}

export async function enableUser(uid, userEmail) {
  try {
    const userRef = ref(db, `users/${uid}`);
    
    await update(userRef, {
      disabled: false,
      enabledAt: new Date().toISOString(),
      enabledBy: auth.currentUser.uid
    });
    
    await logAdminAction('user_enabled', `Enabled user: ${userEmail}`);
    console.log('✅ User enabled:', uid);
    return true;
  } catch (err) {
    console.error('❌ Error enabling user:', err);
    throw err;
  }
}

// ============================================
// PROJECT MODERATION
// ============================================
export async function getAllProjects() {
  try {
    const projectsRef = ref(db, 'projects');
    const snapshot = await get(projectsRef);
    
    if (!snapshot.exists()) {
      console.log('ℹ️ No projects found');
      return [];
    }
    
    const projects = [];
    snapshot.forEach(child => {
      projects.push({
        id: child.key,
        ...child.val()
      });
    });
    
    console.log(`✅ Fetched ${projects.length} projects`);
    return projects;
  } catch (err) {
    console.error('❌ Error fetching projects:', err);
    throw err;
  }
}

export async function approveProject(projectId, projectTitle) {
  try {
    const projectRef = ref(db, `projects/${projectId}`);
    
    await update(projectRef, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: auth.currentUser.uid
    });
    
    await logAdminAction('project_approved', `Approved project: ${projectTitle}`);
    console.log('✅ Project approved:', projectId);
    return true;
  } catch (err) {
    console.error('❌ Error approving project:', err);
    throw err;
  }
}

export async function rejectProject(projectId, projectTitle, reason) {
  try {
    const projectRef = ref(db, `projects/${projectId}`);
    
    await update(projectRef, {
      status: 'rejected',
      rejectionReason: reason,
      rejectedAt: new Date().toISOString(),
      rejectedBy: auth.currentUser.uid
    });
    
    await logAdminAction('project_rejected', `Rejected project: ${projectTitle} - Reason: ${reason}`);
    console.log('✅ Project rejected:', projectId);
    return true;
  } catch (err) {
    console.error('❌ Error rejecting project:', err);
    throw err;
  }
}

export async function deleteProject(projectId, projectTitle) {
  try {
    const projectRef = ref(db, `projects/${projectId}`);
    
    await remove(projectRef);
    
    await logAdminAction('project_deleted', `Deleted project: ${projectTitle}`);
    console.log('✅ Project deleted:', projectId);
    return true;
  } catch (err) {
    console.error('❌ Error deleting project:', err);
    throw err;
  }
}

// ============================================
// SKILLS & DOMAINS MANAGEMENT
// ============================================
export async function getSkills() {
  try {
    const skillsRef = ref(db, 'skills');
    const snapshot = await get(skillsRef);
    
    if (!snapshot.exists()) {
      console.log('ℹ️ No skills found');
      return [];
    }
    
    const skills = [];
    snapshot.forEach(child => {
      skills.push({
        id: child.key,
        ...child.val()
      });
    });
    
    console.log(`✅ Fetched ${skills.length} skills`);
    return skills;
  } catch (err) {
    console.error('❌ Error fetching skills:', err);
    throw err;
  }
}

export async function addSkill(skillName, category) {
  try {
    const skillId = skillName.toLowerCase().replace(/\s+/g, '_');
    const skillRef = ref(db, `skills/${skillId}`);
    
    await set(skillRef, {
      id: skillId,
      name: skillName,
      category: category || 'general',
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser.uid
    });
    
    await logAdminAction('skill_added', `Added skill: ${skillName}`);
    console.log('✅ Skill added:', skillId);
    return skillId;
  } catch (err) {
    console.error('❌ Error adding skill:', err);
    throw err;
  }
}

export async function updateSkill(skillId, updates) {
  try {
    const skillRef = ref(db, `skills/${skillId}`);
    
    await update(skillRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: auth.currentUser.uid
    });
    
    await logAdminAction('skill_updated', `Updated skill: ${skillId}`);
    console.log('✅ Skill updated:', skillId);
    return true;
  } catch (err) {
    console.error('❌ Error updating skill:', err);
    throw err;
  }
}

export async function deleteSkill(skillId, skillName) {
  try {
    const skillRef = ref(db, `skills/${skillId}`);
    
    await remove(skillRef);
    
    await logAdminAction('skill_deleted', `Deleted skill: ${skillName}`);
    console.log('✅ Skill deleted:', skillId);
    return true;
  } catch (err) {
    console.error('❌ Error deleting skill:', err);
    throw err;
  }
}

export async function getDomains() {
  try {
    const domainsRef = ref(db, 'domains');
    const snapshot = await get(domainsRef);
    
    if (!snapshot.exists()) {
      console.log('ℹ️ No domains found');
      return [];
    }
    
    const domains = [];
    snapshot.forEach(child => {
      domains.push({
        id: child.key,
        ...child.val()
      });
    });
    
    console.log(`✅ Fetched ${domains.length} domains`);
    return domains;
  } catch (err) {
    console.error('❌ Error fetching domains:', err);
    throw err;
  }
}

export async function addDomain(domainName) {
  try {
    const domainId = domainName.toLowerCase().replace(/\s+/g, '_');
    const domainRef = ref(db, `domains/${domainId}`);
    
    await set(domainRef, {
      id: domainId,
      name: domainName,
      createdAt: new Date().toISOString(),
      createdBy: auth.currentUser.uid
    });
    
    await logAdminAction('domain_added', `Added domain: ${domainName}`);
    console.log('✅ Domain added:', domainId);
    return domainId;
  } catch (err) {
    console.error('❌ Error adding domain:', err);
    throw err;
  }
}

export async function deleteDomain(domainId, domainName) {
  try {
    const domainRef = ref(db, `domains/${domainId}`);
    
    await remove(domainRef);
    
    await logAdminAction('domain_deleted', `Deleted domain: ${domainName}`);
    console.log('✅ Domain deleted:', domainId);
    return true;
  } catch (err) {
    console.error('❌ Error deleting domain:', err);
    throw err;
  }
}

// ============================================
// ACTIVITY LOGS
// ============================================
export async function logAdminAction(action, description) {
  try {
    const logId = Date.now().toString();
    const logRef = ref(db, `adminLogs/${logId}`);
    
    await set(logRef, {
      id: logId,
      action: action,
      description: description,
      adminUid: auth.currentUser.uid,
      adminEmail: auth.currentUser.email,
      timestamp: new Date().toISOString()
    });
    
    console.log('📝 Admin action logged:', action);
  } catch (err) {
    console.error('❌ Error logging admin action:', err);
  }
}

export async function getAdminLogs(limit = 50) {
  try {
    const logsRef = ref(db, 'adminLogs');
    const snapshot = await get(logsRef);
    
    if (!snapshot.exists()) {
      console.log('ℹ️ No admin logs found');
      return [];
    }
    
    const logs = [];
    snapshot.forEach(child => {
      logs.push({
        id: child.key,
        ...child.val()
      });
    });
    
    // Sort by timestamp, newest first
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    console.log(`✅ Fetched ${logs.length} admin logs`);
    return logs.slice(0, limit);
  } catch (err) {
    console.error('❌ Error fetching admin logs:', err);
    throw err;
  }
}

// ============================================
// DASHBOARD STATISTICS
// ============================================
export async function getDashboardStats() {
  try {
    const stats = {
      totalUsers: 0,
      totalProjects: 0,
      totalTeams: 0,
      totalColleges: 0,
      pendingProjects: 0,
      disabledUsers: 0
    };
    
    // Count users
    const usersRef = ref(db, 'users');
    const usersSnapshot = await get(usersRef);
    if (usersSnapshot.exists()) {
      const users = usersSnapshot.val();
      stats.totalUsers = Object.keys(users).length;
      Object.values(users).forEach(user => {
        if (user.disabled) stats.disabledUsers++;
      });
    }
    
    // Count projects
    const projectsRef = ref(db, 'projects');
    const projectsSnapshot = await get(projectsRef);
    if (projectsSnapshot.exists()) {
      const projects = projectsSnapshot.val();
      stats.totalProjects = Object.keys(projects).length;
      Object.values(projects).forEach(project => {
        if (project.status === 'pending' || !project.status) {
          stats.pendingProjects++;
        }
      });
    }
    
    // Count colleges
    const collegesRef = ref(db, 'colleges');
    const collegesSnapshot = await get(collegesRef);
    if (collegesSnapshot.exists()) {
      stats.totalColleges = Object.keys(collegesSnapshot.val()).length;
    }
    
    // Count teams (projects with members)
    if (projectsSnapshot.exists()) {
      const projects = projectsSnapshot.val();
      Object.values(projects).forEach(project => {
        if (project.teamMembers && Object.keys(project.teamMembers).length > 1) {
          stats.totalTeams++;
        }
      });
    }
    
    console.log('✅ Dashboard stats loaded:', stats);
    return stats;
  } catch (err) {
    console.error('❌ Error fetching dashboard stats:', err);
    throw err;
  }
}
