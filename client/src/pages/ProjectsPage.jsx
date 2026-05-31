import { useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/PageHeader";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Modal, { ModalActions } from "../components/ui/Modal";
import Select from "../components/ui/Select";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export default function ProjectsPage() {
  const { projects, users, createProject, addMember } = useApp();
  const { isAdmin } = useAuth();
  const [projectModal, setProjectModal] = useState(false);
  const [memberModal, setMemberModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [memberForm, setMemberForm] = useState({ projectId: "", userEmail: "", role: "member" });
  const [saving, setSaving] = useState(false);

  async function handleCreateProject() {
    if (!projectForm.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    setSaving(true);
    try {
      await createProject(projectForm);
      setProjectForm({ name: "", description: "" });
      setProjectModal(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddMember() {
    if (!memberForm.projectId || !memberForm.userEmail) {
      toast.error("Select project and member email");
      return;
    }
    setSaving(true);
    try {
      await addMember(memberForm.projectId, {
        userEmail: memberForm.userEmail,
        role: memberForm.role
      });
      setMemberForm({ projectId: "", userEmail: "", role: "member" });
      setMemberModal(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader title="Projects" subtitle="Manage team projects and memberships">
        {isAdmin ? (
          <Button className="w-full sm:w-auto" onClick={() => setProjectModal(true)}>
            <Plus size={16} />
            New Project
          </Button>
        ) : null}
        <Button className="w-full sm:w-auto" variant="secondary" onClick={() => setMemberModal(true)}>
          Add Member
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <h3 className="font-semibold text-white">{project.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">
              {project.description || "No description"}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-brand-600/20 px-2.5 py-0.5 text-xs capitalize text-brand-300">
                {project.memberRole}
              </span>
              <span className="text-xs text-slate-500">
                {project.members?.length || 0} members
              </span>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-slate-500 sm:text-base">
            No projects yet. Admins can create one.
          </p>
        </Card>
      ) : null}

      <Modal open={projectModal} onClose={() => setProjectModal(false)} title="Create Project">
        <Input
          label="Name"
          value={projectForm.name}
          onChange={(e) => setProjectForm((p) => ({ ...p, name: e.target.value }))}
        />
        <Input
          label="Description"
          value={projectForm.description}
          onChange={(e) => setProjectForm((p) => ({ ...p, description: e.target.value }))}
        />
        <ModalActions
          onCancel={() => setProjectModal(false)}
          onConfirm={handleCreateProject}
          confirmLabel="Create"
          loading={saving}
        />
      </Modal>

      <Modal open={memberModal} onClose={() => setMemberModal(false)} title="Add Project Member">
        <Select
          label="Project"
          value={memberForm.projectId}
          onChange={(e) => setMemberForm((p) => ({ ...p, projectId: e.target.value }))}
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        <Select
          label="User"
          value={memberForm.userEmail}
          onChange={(e) => setMemberForm((p) => ({ ...p, userEmail: e.target.value }))}
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.email}>
              {u.name} ({u.email})
            </option>
          ))}
        </Select>
        <Select
          label="Project role"
          value={memberForm.role}
          onChange={(e) => setMemberForm((p) => ({ ...p, role: e.target.value }))}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </Select>
        <ModalActions
          onCancel={() => setMemberModal(false)}
          onConfirm={handleAddMember}
          confirmLabel="Add"
          loading={saving}
        />
      </Modal>
    </div>
  );
}
