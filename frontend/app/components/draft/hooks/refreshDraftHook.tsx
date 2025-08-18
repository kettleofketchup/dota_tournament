import { toast } from 'sonner';
import { fetchDraft } from '~/components/api/api';
import type { DraftType } from '~/index';
import { getLogger } from '~/lib/logger';
const log = getLogger('RefreshDraftHook');

type hookParams = {
  draft: DraftType;
  setDraft: (draft: DraftType) => void;
};

export const refreshDraftHook = async ({ draft, setDraft }: hookParams) => {
  if (!draft) {
    log.error('No draft found');
    return;
  }

  if (!draft.pk) {
    log.error('No tournament primary key found');
    return;
  }
  log.debug('refreshing draft', draft.pk);

  toast.promise(fetchDraft(draft.pk), {
    loading: `Refreshing draft rounds...`,
    success: (data) => {
      setDraft(data);
      return `Tournament Draft has been refresh!`;
    },
    error: (err) => {
      const val = err.response.data;
      log.error('Tournament Draft has failed to Reinitialize!', err);
      return `Failed to Reinitialize tournament draft: ${val}`;
    },
  });
};
